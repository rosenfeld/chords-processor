#ALL_CHORDS = ['A', 'B♭', 'B', 'C', 'C♯', 'D', 'E♭', 'E', 'F', 'G', 'A♭']

NOTES = [
  'A', ['B♭', 'A♯'], 'B', 'C', ['D♭', 'C♯'], 'D',
  ['E♭', 'D♯'], 'E', 'F', ['G♭', 'F♯'], 'G', ['A♭', 'G♯']
]

NORMALIZED = [
  'I', '♯I', 'II', '♭III', 'III', 'IV', '♯IV',
  'V', '♭VI', 'VI', '♭VII', 'VII'
]

SCALES = {
  'A':  ['A' , 'A♯', 'B' , 'C' , 'C♯', 'D' , 'D♯', 'E' , 'F' , 'F♯', 'G' , 'G♯'],
  'B♭': ['B♭', 'B' , 'C' , 'D♭', 'D' , 'E♭', 'E' , 'F' , 'G♭', 'G' , 'A♭', 'A' ],
  'B':  ['B' , 'C' , 'C♯', 'D' , 'D♯', 'E' , 'F' , 'F♯', 'G' , 'G♯', 'A' , 'A♯'],
  'C':  ['C' , 'C♯', 'D' , 'E♭', 'E' , 'F' , 'F♯', 'G' , 'A♭', 'A' , 'B♭', 'B' ],
  'D♭': ['D♭', 'D' , 'E♭', 'E' , 'F' , 'G♭', 'G' , 'A♭', 'A' , 'B♭', 'B' , 'C' ],
  'D':  ['D' , 'D♯', 'E' , 'F' , 'F♯', 'G' , 'G♯', 'A' , 'B♭', 'B' , 'C' , 'C♯'],
  'E♭': ['E♭', 'E' , 'F' , 'G♭', 'G' , 'A♭', 'A' , 'B♭', 'B' , 'C' , 'D♭', 'D' ],
  'E':  ['E' , 'F' , 'F♯', 'G' , 'G♯', 'A' , 'A♯', 'B' , 'C' , 'C♯', 'D' , 'D♯'],
  'F':  ['F' , 'F♯', 'G' , 'A♭', 'A' , 'B♭', 'B' , 'C' , 'D♭', 'D' , 'E♭', 'E' ],
  'F♯': ['F♯', 'G' , 'G♯', 'A' , 'A♯', 'B' , 'C' , 'C♯', 'D' , 'D♯', 'E' , 'F' ],
  'G':  ['G' , 'G♯', 'A' , 'B♭', 'B' , 'C' , 'C♯', 'D' , 'D♯', 'E' , 'F' , 'F♯'],
  'A♭': ['A♭', 'A' , 'B♭', 'B' , 'C' , 'D♭', 'D' , 'E♭', 'E' , 'F' , 'G♭', 'G' ],
}
# TODO: should we support other "to" notes, like 'G#' instead of 'Ab'?
# some aliases to simplify logic:
SCALES["#{l}b"] = SCALES["#{l}♭"] for l in ['B', 'D', 'E', 'A']
SCALES['F#'] = SCALES['F♯']
# use the same for minor tones for now:
SCALES["#{l}m"] = s for l, s of SCALES

INVERTED_REGEX = /(\/\s*)([A-G][#♯b♭]?)\s*$/
TONE_REGEX = /^[A-G][#♯b♭]?/
(window ? exports).Transposer = class Transposer
  constructor: (@from, @to)->
    @tone = @from.replace(/^([A-G][#♯b♭]?).*/, '$1') if @from
    @toScale = SCALES[@to] if @to

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
    chord = chord.replace TONE_REGEX, NORMALIZED[@relativeIdx(chord)]
    chord.replace INVERTED_REGEX, (_, prefix, inversion) =>
      prefix + @normalize(inversion)

  transpose: (chord)->
    remaining = chord.replace TONE_REGEX, ''
    remaining = remaining.replace INVERTED_REGEX, (_, prefix, inversion) =>
      prefix + @transpose(inversion)
    @toScale[@relativeIdx chord] + remaining
