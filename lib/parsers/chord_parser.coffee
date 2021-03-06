Transposer = window?.Transposer or require('../transposer/transposer').Transposer
(window ? exports).Parser = class Parser
  constructor: (@source) ->

  parse: ->
    @processDirectives()
    @transposer or= new Transposer(@attributes.tone) if @attributes.tone
    lines: @source.split("\n").map(@processLine).filter (l)-> l isnt null
    attributes: @attributes

  processDirectives: ->
    return if @attributes
    @attributes = {}
    @source.match(/{.*?}/g)?.forEach (directive)=>
      [key, value] = directive[1..-2].split(':').map (d)-> d.trim()
      @attributes[key.toLowerCase()] = value
    @source = @source.replace(/{.*?}/g, '')

  processLine: (line)=>
    line = line.trim()
    return null if line is '' and @lastProcessedLine is ''
    @lastProcessedLine = line
    chordExpr = "\\[[A-G].*?\\]"; regex = new RegExp(chordExpr, 'g')
    lyrics = line.split regex
    chords = line.match(regex)?.map (chord)->
      chord[1..-2].replace('b', '\u266d').replace('#', '\u266f')
    if new RegExp("^#{chordExpr}").test(line) then lyrics.shift()
    else chords?.unshift ''
    if chords and @transposer
      normalized = chords.map (chord)=>
        chord and @transposer.normalize(chord) or ''
      if @transposer.to then chords = chords.map (chord)=>
        chord and @transposer.transpose(chord) or ''
    chords: chords, lyrics: lyrics, normalized: normalized

  transposeTo: (tone)->
    @processDirectives()
    @transposer = new Transposer(@attributes.tone, tone)
    this

