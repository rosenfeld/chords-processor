(window ? exports).Parser = class Parser
  constructor: (@source) ->

  parse: -> @source.split("\n").map @processLine

  processLine: (line)->
    line = line.trim()
    chordExpr = "\\[[A-G].*?\\]"; regex = new RegExp(chordExpr, 'g')
    lyrics = line.split regex
    chords = line.match(regex)?.map (chord)->
      chord[1..-2].replace('b', '\u266d').replace('#', '\u266f')
    if new RegExp("^#{chordExpr}").test(line) then lyrics.shift()
    else chords?.unshift ''
    chords: chords, lyrics: lyrics
