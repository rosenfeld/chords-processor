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
    itemName = decodePath(item.path).replace(/^\"/, '').replace(/\"$/, '')
    $('<a href="#"/>').text(itemName).appendTo(container).click ->
      $.getJSON("#{item.url}?callback=?", replaceSong)

decodePath = (path)->
  # simplification of https://gist.github.com/2762688:
  # function getCodePoint(array) {
  #
  #	/*-----------------------------------------------------------------------------------------
  #	[UCS-2 (UCS-4)]      [bit pattern]        [1st byte]  [2nd byte]  [3rd byte]  [4th byte]
  #	U+ 0000..  U+007F    00000000-0xxxxxxx     0xxxxxxx
  #	U+ 0080..  U+07FF    00000xxx-xxyyyyyy     110xxxxx    10yyyyyy
  #	U+ 0800..  U+FFFF    xxxxyyyy-yyzzzzzz     1110xxxx    10yyyyyy    10zzzzzz    
  #	U+10000..U+1FFFFF    00000000-000wwwxx     11110www    10xxxxxx    10yyyyyy    10zzzzzz
  #	                     -xxxxyyyy-yyzzzzzzz
  #	------------------------------------------------------------------------------------------*/
  #
  #	var bytes = array.length;
  #	var firstShift = (bytes === 1) ? 0 : (bytes + 1);
  #	var codePoint =	ar[0] & (0xFF >> firstShift);
  #	for(var n = 1; n < bytes; n++) {
  #		codePoint <<= 6;
  #		codePoint += array[n] & 0x3F;	// Mask 0x00111111
  #	}
  #	return codePoint;
  # }
  decodeURI escape(path).replace /%5C(\d{3})%5C(\d{3})/gi, (_, oct1, oct2)->
    String.fromCharCode(((0x3f & parseInt(oct1, 8)) << 6) + (parseInt(oct2, 8) & 0x3f))

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
