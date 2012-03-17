Parser = window?.Parser or require('../parsers/chord_parser').Parser
(window ? exports).SourceTransposer = class SourceTransposer
  constructor: (@source, @to)->
    @transposer = new Parser(@source).transposeTo(@to).transposer

  transposedSource: ->
    regex = /\[([A-G].*?)\]/g
    dest = @source
    while m = regex.exec @source
      dest = dest.replace(m[0], "[#{@transposer.transpose(m[1])}]")
    m = /({\s*?tone\s*?:\s*?)([A-G])(.*?})/.exec dest
    dest
      .replace(m[0], "#{m[1]}#{@transposer.transpose m[2]}#{m[3]}")
      .replace(/♯/g, '#').replace(/♭/g, 'b')
