// Generated by CoffeeScript 1.10.0
(function() {
  var fetchSongListFromGithub, onInputChange, processSong, renderGithubSongsList, replaceSong, setupChordsVisibility, setupGithubIntegration, setupTransposition;

  $(function() {
    $('#customize').click(function() {
      return $('#stylesheet').dialog({
        width: '800px'
      });
    });
    $('#inplace-edit').on('change', function() {
      return $('#input-container').toggle(this.checked);
    });
    $('#stylesheet textarea').on('change keyup', function() {
      return $('#songstyle').text($(this).val());
    }).change();
    $('#input').on('change keyup mouseup input', onInputChange).change();
    setupGithubIntegration();
    setupTransposition();
    return setupChordsVisibility();
  });

  onInputChange = function() {
    var tone;
    $('#song').html(processSong($(this).val()));
    tone = $('#transposition select').val();
    if (tone) {
      $('#song .tone').text(tone);
    }
    $('#song tr.chords').toggle($('#show-real-chords')[0].checked);
    $('#song tr.normalized-chords').toggle($('#show-normalized-chords')[0].checked);
    return $('#song tr.lyrics').toggle($('#show-lyrics')[0].checked);
  };

  processSong = function(input) {
    var parser, tone;
    parser = new Parser(input);
    tone = $('#transposition select').val();
    if (tone) {
      parser.transposeTo(tone);
    }
    return new HtmlFormatter(parser.parse()).format();
  };

  setupGithubIntegration = function() {
    $('#fetch-from-github').click(function() {
      return $('#github-dialog').dialog({
        modal: true,
        width: '90%',
        height: 500
      });
    });
    return $('#github-get-songs-list-button').click(fetchSongListFromGithub);
  };

  fetchSongListFromGithub = function() {
    var repo, user;
    user = $('#github-userid').val();
    repo = $('#github-repositoryid').val();
    return $.getJSON("https://api.github.com/repos/" + user + "/" + repo + "/git/trees/master?recursive=1&callback=?", renderGithubSongsList);
  };

  renderGithubSongsList = function(response) {
    var container, tree;
    $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining']);
    tree = response.data.tree;
    container = $('#github-songs-list').empty();
    return tree.forEach(function(item) {
      if (item.type !== 'blob') {
        return;
      }
      return $('<a href="#"/>').text(item.path).appendTo(container).click(function() {
        return $.getJSON(item.url + "?callback=?", replaceSong);
      });
    });
  };

  replaceSong = function(response) {
    var base64Content;
    $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining']);
    base64Content = response.data.content;
    $('#transposition select').val('');
    $('#input').val(decode(base64Content)).change();
    return $('#github-dialog').dialog('close');
  };

  setupTransposition = function() {
    $(document).on('click', '#song .tone', function() {
      return $('#transposition').dialog();
    });
    return $('#transposition select').on('change', function() {
      var tone, transposed;
      tone = $('#transposition select').val();
      transposed = new SourceTransposer($('#input').text(), tone).transposedSource();
      return $('#input').text(transposed).change();
    });
  };

  setupChordsVisibility = function() {
    $('#show-real-chords').change(function() {
      return $('#song tr.chords').toggle();
    });
    $('#show-normalized-chords').change(function() {
      return $('#song tr.normalized-chords').toggle();
    });
    $('#show-lyrics').change(function() {
      return $('#song tr.lyrics').toggle();
    });
    return $('#two-columns').change(function() {
      return $('#song').toggleClass('two-column');
    });
  };

}).call(this);
