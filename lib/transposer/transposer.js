// const ALL_CHORDS = ['A', 'B♭', 'B', 'C', 'C♯', 'D', 'E♭', 'E', 'F', 'G', 'A♭']

const NOTES = [
  'A', ['B♭', 'A♯'], 'B', 'C', ['D♭', 'C♯'], 'D',
  ['E♭', 'D♯'], 'E', 'F', ['G♭', 'F♯'], 'G', ['A♭', 'G♯'],
];

const NORMALIZED = [
  'I', '♯I', 'II', '♭III', 'III', 'IV', '♯IV',
  'V', '♭VI', 'VI', '♭VII', 'VII',
];

/* eslint-disable */
const SCALES = {
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
};
/* eslint-enable */

// TODO: should we support other "to" notes, like 'G#' instead of 'Ab'?
// some aliases to simplify logic:
for (const l of ['B', 'D', 'E', 'A']) SCALES[`${l}b`] = SCALES[`${l}♭`];
SCALES['F#'] = SCALES['F♯'];
// use the same for minor tones for now:
for (const [l, s] of Object.entries(SCALES)) SCALES[`${l}m`] = s;

const INVERTED_REGEX = /(\/\s*)([A-G][#♯b♭]?)\s*$/;
const TONE_REGEX = /^[A-G][#♯b♭]?/;
export default class Transposer {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    if (from) this.tone = from.replace(/^([A-G][#♯b♭]?).*/, '$1');
    if (to) this.toScale = SCALES[to];
  }

  relativeIdx(chord) {
    let idx = absoluteIdx(chord) - absoluteIdx(this.tone);
    if (idx < 0) idx += 12;
    return idx;
  }

  normalize(_chord) {
    const chord = _chord.replace(TONE_REGEX, NORMALIZED[this.relativeIdx(_chord)]);
    return chord.replace(
      INVERTED_REGEX,
      (_, prefix, inversion) => prefix + this.normalize(inversion),
    );
  }

  transpose(chord) {
    let remaining = chord.replace(TONE_REGEX, '');
    remaining = remaining.replace(
      INVERTED_REGEX,
      (_, prefix, inversion) => prefix + this.transpose(inversion),
    );
    return this.toScale[this.relativeIdx(chord)] + remaining;
  }
}

export function absoluteIdx(chord) {
  const [letter, accident] = chord.slice(0, 2);
  let idx = NOTES.indexOf(letter);
  if (['#', '♯'].includes(accident)) idx += 1;
  if (['b', '♭'].includes(accident)) idx -= 1;
  if (idx === -1) idx = 11;
  return idx;
}
