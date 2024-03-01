import Transposer, { absoluteIdx } from '../../lib/transposer/transposer.js';

describe('Transposer', () => {
  it('gets absolute index relative to A', () => {
    expect(absoluteIdx('C')).toEqual(3);
    expect(absoluteIdx('C#')).toEqual(4);
    expect(absoluteIdx('Db')).toEqual(4);
    expect(absoluteIdx('G♯')).toEqual(11);
    expect(absoluteIdx('A♭')).toEqual(11);
  });

  it('gets relative index relative to tone', () => {
    const transposer = new Transposer('D');
    expect(transposer.relativeIdx('D')).toEqual(0);
    expect(transposer.relativeIdx('C#')).toEqual(11);
    expect(transposer.relativeIdx('D#')).toEqual(1);
    expect(transposer.relativeIdx('E')).toEqual(2);
    expect(transposer.relativeIdx('Ab')).toEqual(6);
  });

  it('normalizes chords', () => {
    const transposer = new Transposer('D');
    const expectations = {
      D: 'I', 'D♯': '♯I', Eb: '♯I', E: 'II', Dm7: 'Im7',
    };
    for (const [base, normalized] of Object.entries(expectations)) {
      expect(transposer.normalize(base)).toEqual(normalized);
    }
  });

  it('transposes between major tones', () => {
    const transposer = new Transposer('C', 'F');
    const expectations = {
      C: 'F', 'C#': 'F♯', Ebº: 'A♭º', Dm7: 'Gm7', F: 'B♭', 'F#º': 'Bº',
    };
    for (const [chord, transposed] of Object.entries(expectations)) {
      expect(transposer.transpose(chord)).toEqual(transposed);
    }
  });

  it('transposes from A to Bb', () => {
    const transposer = new Transposer('A', 'Bb');
    const expectations = { A: 'B♭' };
    for (const [chord, transposed] of Object.entries(expectations)) {
      expect(transposer.transpose(chord)).toEqual(transposed);
    }
  });

  it('transposes from Bb to A', () => {
    const transposer = new Transposer('Bb', 'A');
    const expectations = { Bb: 'A' };
    for (const [chord, transposed] of Object.entries(expectations)) {
      expect(transposer.transpose(chord)).toEqual(transposed);
    }
  });

  it('transposes between minor tones', () => {
    const transposer = new Transposer('Am', 'Dm');
    const expectations = {
      Am: 'Dm', 'Bm7(b5)': 'Em7(b5)', E7: 'A7', A7: 'D7', Dm6: 'Gm6', 'G#m7(b5)': 'C♯m7(b5)',
    };
    for (const [chord, transposed] of Object.entries(expectations)) {
      expect(transposer.transpose(chord)).toEqual(transposed);
    }
  });

  it('transposes inverted chords', () => {
    const transposer = new Transposer('C', 'F');
    const expectations = { 'Cm7/B♭': 'Fm7/E♭', 'A7/C♯': 'D7/F♯', 'Dm7/C': 'Gm7/F' };
    for (const [chord, transposed] of Object.entries(expectations)) {
      expect(transposer.transpose(chord)).toEqual(transposed);
    }
  });
});
