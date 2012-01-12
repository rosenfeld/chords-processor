(window ? exports).HtmlFormatter = class HtmlFormatter
  constructor: (@parsedInput) ->

  format: -> @parsedInput.map(@formatEntry).join('\n')

  formatEntry: (entry) ->
    unless entry.chords
      lyric = entry.lyrics[0]
      return if lyric then "<div class=lyrics>#{lyric}</div>" else "<br/>"
    '<table class=chords><tr class=chords><th>' +
      entry.chords.join('</th><th>') +
      '</th></tr><tr class=lyrics><td>' +
      entry.lyrics.join('</td><td>') +
      '</td></tr></table>'

