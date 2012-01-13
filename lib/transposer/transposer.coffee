#ALL_CHORDS = ['A', 'B♭', 'B', 'C', 'C♯', 'D', 'E♭', 'E', 'F', 'G', 'A♭']

NOTES = [
  'A', ['B♭', 'A♯'], 'B', 'C', ['D♭', 'C♯'], 'D',
  ['E♭', 'D♯'], 'E', 'F', ['G♭', 'F♯'], 'G', ['A♭', 'G♯']
]

NORMALIZED = [
  'I', 'I♯', 'II', 'III♭', 'III', 'IV', 'IV♯',
  'V', 'VI♭', 'VI', 'VII♭', 'VII'
]
# - 1, b - 0
ACCIDENTS  = [ 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1 ]
# C  - C# - D  - Eb - E  - F  - F# - G  - Ab - A  - Bb - B
# D  - D# - E  - F  - F# - G  - G# - A  - Bb - B  - C  - C#
# E  - F  - F# - G  - G# - A  - A# - B  - C  - C# - D  - D#
# F  - F# - G  - Ab - A  - Bb - B  - C  - Db - D  - Eb - E
# G  - G# - A  - Bb - B  - C  - C# - D  - Eb - E  - F  - F#
# A  - A# - B  - C  - C# - D  - D# - E  - F  - F# - G  - G#
# B  - C  - C# - D  - D# - E  - F  - F# - G  - G# - A  - A#

INVERTED_REGEX = /(\/\s*)([A-G][#♯b♭]?)\s*$/
(window ? exports).Transposer = class Transposer
  constructor: (@from, @to)->
    if @from
      [@tone, @accident] = @from[0..1]
      @accident = null unless @accident in ['#', '♯', 'b', '♭']
      @minor = @from[@accident is null ? 1 : 2] is 'm'
      @absolute = @absoluteIdx(@from)
    if @to
      @delta = @relativeIdx(@to)
      @toTransposer = new Transposer(@to)

  absoluteIdx: (chord)->
    [letter, accident] = chord[0..1]
    idx = NOTES.indexOf(letter)
    idx += 1 if accident in ['#', '♯']
    idx -= 1 if accident in ['b', '♭']
    idx = 11 if idx is -1
    idx

  relativeIdx: (chord)->
    idx = @absoluteIdx(chord) - @absoluteIdx(@tone)
    idx += 12 if idx < 0
    idx

  normalize: (chord)->
    chord = chord.replace /^[A-G][#♯b♭]?/, NORMALIZED[@relativeIdx(chord)]
    chord.replace INVERTED_REGEX, (_, prefix, inversion) =>
      prefix + @normalize(inversion)

  transpose: (chord)->
    newIdx = @relativeIdx(chord) + @delta + @absolute
    newIdx -= 12 while newIdx >= 12
    remaining = chord.replace /^[A-G][b#♭♯]?/, ''
    transposed = NOTES[newIdx]
    if transposed[1]
      ridx = @toTransposer.relativeIdx(transposed[0])
      transposed = transposed[ACCIDENTS[ridx]]
    remaining = remaining.replace INVERTED_REGEX, (_, prefix, inversion) =>
      prefix + @transpose(inversion)
    transposed + remaining
