(window ? exports).HtmlFormatter = class HtmlFormatter
  constructor: (@parsedInput) ->

  format: ->
    @output = ''
    @attributes = @parsedInput.attributes
    @addTitle() if @attributes.title
    @addAuthor() if @attributes.author
    @addArtist() if @attributes.artist
    @addTone() if @attributes.tone
    @output += @parsedInput.lines.map(@formatEntry).join('\n')

  formatEntry: (entry) ->
    unless entry.chords
      lyric = entry.lyrics[0]
      return if lyric then "<div class=lyrics>#{lyric}</div>" else "<br/>"
    '<table class=chords><tr class=chords><th>' +
      entry.chords.join('</th><th>') +
      '</th></tr><tr class=lyrics><td>' +
      entry.lyrics.join('</td><td>') +
      '</td></tr></table>'

  addTitle: -> @output += "<h1 class=title>#{@attributes.title}</h1>\n"
  addAuthor: -> @output += "<h2 class=author>#{@attributes.author}</h2>\n"
  addArtist: -> @output += "<h2 class=artist>#{@attributes.artist}</h2>\n"
  addTone: -> @output += "<h2 class=tone>#{@attributes.tone}</h2>\n"
