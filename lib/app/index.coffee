$ ->
  $('#customize').click -> $('#stylesheet').dialog(width: '800px')
  $('#inplace-edit').on('change', -> $('#input-container').toggle(this.checked))
  $('#stylesheet textarea').on('change keyup', -> $('#songstyle').text($(this).val())).change()
  $('#input').on('change keyup mouseup input', -> $('#song').html(processSong($(this).val()))).change()
  setupGithubIntegration()

processSong = (input) ->
  new HtmlFormatter(new Parser(input).parse()).format()

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
  # TODO - sort by name first
  tree.forEach (item)->
    return unless item.type is 'blob'
    $('<a href="#"/>').text(item.path).appendTo(container).click ->
      $.getJSON("#{item.url}?callback=?", replaceSong)

replaceSong = (response)->
  $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining'])
  base64Content = response.data.content
  $('#input').val(decode(base64Content)).change()
  $('#github-dialog').dialog('close')


