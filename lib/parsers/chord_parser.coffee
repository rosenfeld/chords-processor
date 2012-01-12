(window ? exports).Parser = class Parser
  constructor: (@source) ->

  parse: ->
    @processDirectives()
    lines: @source.split("\n").map(@processLine).filter (l)-> l isnt null
    attributes: @attributes

  processDirectives: ->
    @attributes = {}
    @source.match(/{.*?}/g)?.forEach (directive)=>
      [key, value] = directive[1..-2].split(':').map (d)-> d.trim()
      @attributes[key.toLowerCase()] = value
    @source = @source.replace(/{.*?}/g, '')

  processLine: (line)->
    line = line.trim()
    return null if line is '' and @lastProcessedLine is ''
    @lastProcessedLine = line
    chordExpr = "\\[[A-G].*?\\]"; regex = new RegExp(chordExpr, 'g')
    lyrics = line.split regex
    chords = line.match(regex)?.map (chord)->
      chord[1..-2].replace('b', '\u266d').replace('#', '\u266f')
    if new RegExp("^#{chordExpr}").test(line) then lyrics.shift()
    else chords?.unshift ''
    chords: chords, lyrics: lyrics
