$ ->
  $('#customize').click -> $('#stylesheet').dialog(width: '800px')
  $('#inplace-edit').on('change', -> $('#input-container').toggle(this.checked))
  $('#stylesheet textarea').on('change keyup', -> $('#songstyle').text($(this).val())).change()
  $('#input').on('change keyup mouseup input', onInputChange).change()

  setupGithubIntegration()
  setupTransposition()
  setupChordsVisibility()

onInputChange = ->
    $('#song').html(processSong($(this).val()))
    tone = $('#transposition select').val()
    $('#song .tone').text(tone) if tone
    $('#song tr.chords').toggle($('#show-real-chords')[0].checked)
    $('#song tr.normalized-chords').toggle($('#show-normalized-chords')[0].checked)
    $('#song tr.lyrics').toggle($('#show-lyrics')[0].checked)

processSong = (input) ->
  parser = new Parser(input)
  tone = $('#transposition select').val()
  parser.transposeTo(tone) if tone
  new HtmlFormatter(parser.parse()).format()

setupGithubIntegration = ->
  $('#fetch-from-github').click -> $('#github-dialog').dialog(modal: true, width: '90%', height: 500)
  $('#github-get-songs-list-button').click fetchSongListFromGithub

fetchSongListFromGithub = ->
  user = $('#github-userid').val()
  repo = $('#github-repositoryid').val()
  $.getJSON "https://api.github.com/repos/#{user}/#{repo}/git/trees/master?recursive=1&callback=?", renderGithubSongsList

renderGithubSongsList = (response)->
  $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining'])
  tree = response.data.tree
  container = $('#github-songs-list').empty()
  tree.forEach (item)->
    return unless item.type is 'blob'
    $('<a href="#"/>').text(item.path).appendTo(container).click ->
      $.getJSON("#{item.url}?callback=?", replaceSong)

replaceSong = (response)->
  $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining'])
  base64Content = response.data.content
  $('#transposition select').val('') # reset to the original tone
  $('#input').val(decode(base64Content)).change()
  $('#github-dialog').dialog('close')

setupTransposition = ->
  $(document).on 'click', '#song .tone', -> $('#transposition').dialog()
  $('#transposition select').on 'change', ->
    tone = $('#transposition select').val()
    transposed = new SourceTransposer($('#input').text(), tone).transposedSource()
    $('#input').text(transposed).change()

setupChordsVisibility = ->
  $('#show-real-chords').change -> $('#song tr.chords').toggle()
  $('#show-normalized-chords').change -> $('#song tr.normalized-chords').toggle()
  $('#show-lyrics').change -> $('#song tr.lyrics').toggle()
  $('#two-columns').change -> $('#song').toggleClass('two-column')
