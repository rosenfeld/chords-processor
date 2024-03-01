import Parser from '../parsers/chord_parser.js';
import HtmlFormatter from '../formatters/html_formatter.js';
import SourceTransposer from '../transposer/source_transposer.js';

const { $ } = window; // to make eslint happy

$(() => {
  $('#customize').click(() => { $('#stylesheet').dialog({ width: '800px' }); });
  $('#inplace-edit').on('change', onInplaceEditCheck);
  $('#stylesheet textarea').on('change keyup', onStylesheetChange).change();
  $('#input').on('change keyup mouseup input', onInputChange).change();

  setupGithubIntegration();
  setupTransposition();
  setupChordsVisibility();
});

function onInplaceEditCheck() {
  $('#input-container').toggle(this.checked);
}

function onStylesheetChange() {
  $('#songstyle').text($(this).val());
}

function onInputChange() {
  $('#song').html(processSong($(this).val()));
  const tone = $('#transposition select').val();
  if (tone) $('#song .tone').text(tone);
  $('#song tr.chords').toggle($('#show-real-chords')[0].checked);
  $('#song tr.normalized-chords').toggle($('#show-normalized-chords')[0].checked);
  $('#song tr.lyrics').toggle($('#show-lyrics')[0].checked);
}

function processSong(input) {
  const parser = new Parser(input);
  const tone = $('#transposition select').val();
  if (tone) parser.transposeTo(tone);
  return new HtmlFormatter(parser.parse()).format();
}

function setupGithubIntegration() {
  $('#fetch-from-github').click(() => {
    $('#github-dialog').dialog({ modal: true, width: '90%', height: 500 });
  });
  $('#github-get-songs-list-button').click(fetchSongListFromGithub);
}

function fetchSongListFromGithub() {
  const user = $('#github-userid').val();
  const repo = $('#github-repositoryid').val();
  $.getJSON(userRepoUrl(user, repo), renderGithubSongsList);
}

function userRepoUrl(user, repo) {
  return `https://api.github.com/repos/${user}/${repo}/git/trees/master?recursive=1&callback=?`;
}

function renderGithubSongsList(response) {
  $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining']);
  const { tree } = response.data;
  const container = $('#github-songs-list').empty();
  tree.forEach((item) => {
    if (item.type !== 'blob') return;
    $('<a href="#"/>').text(item.path).appendTo(container).click(() => {
      $.getJSON(`${item.url}?callback=?`, replaceSong);
    });
  });
}

function replaceSong(response) {
  $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining']);
  const base64Content = response.data.content;
  $('#transposition select').val(''); // reset to the original tone
  $('#input').val(decodeBase64(base64Content)).change();
  $('#github-dialog').dialog('close');
}

function decodeBase64(content) {
  return new TextDecoder().decode(Uint8Array.from(atob(content), (m) => m.codePointAt(0)));
}

function setupTransposition() {
  $(document).on('click', '#song .tone', () => { $('#transposition').dialog(); });
  $('#transposition select').on('change', () => {
    const tone = $('#transposition select').val();
    const transposed = new SourceTransposer($('#input').text(), tone).transposedSource();
    $('#input').text(transposed).change();
  });
}

function setupChordsVisibility() {
  $('#show-real-chords').change(() => { $('#song tr.chords').toggle(); });
  $('#show-normalized-chords').change(() => { $('#song tr.normalized-chords').toggle(); });
  $('#show-lyrics').change(() => { $('#song tr.lyrics').toggle(); });
  $('#two-columns').change(() => { $('#song').toggleClass('two-column'); });
}
