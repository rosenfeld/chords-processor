Transposer = require('../../lib/transposer/transposer').Transposer

describe 'Transposer', ->
  it 'gets absolute index relative to A', ->
    transposer = new Transposer()
    expect(transposer.absoluteIdx('C')).toEqual(3)
    expect(transposer.absoluteIdx('C#')).toEqual(4)
    expect(transposer.absoluteIdx('Db')).toEqual(4)
    expect(transposer.absoluteIdx('G♯')).toEqual(11)
    expect(transposer.absoluteIdx('A♭')).toEqual(11)
    
  it 'gets relative index relative to tone', ->
    transposer = new Transposer('D')
    expect(transposer.relativeIdx('D')).toEqual(0)
    expect(transposer.relativeIdx('C#')).toEqual(11)
    expect(transposer.relativeIdx('D#')).toEqual(1)
    expect(transposer.relativeIdx('E')).toEqual(2)
    expect(transposer.relativeIdx('Ab')).toEqual(6)

  it 'normalizes chords', ->
    transposer = new Transposer('D')
    expectations = {D: 'I', 'D♯': '♯I', Eb: '♯I', E: 'II', 'Dm7': 'Im7'}
    expect(transposer.normalize(base)).toEqual(normalized) for base, normalized of expectations

  it 'transposes between major tones', ->
    transposer = new Transposer('C', 'F')
    expectations = {
      'C': 'F', 'C#': 'F♯', 'Ebº': 'A♭º', 'Dm7': 'Gm7',
      'F': 'B♭', 'F#º': 'Bº'
    }
    expect(transposer.transpose(chord)).toEqual(transposed) for chord, transposed of expectations

  it 'transposes between minor tones', ->
    transposer = new Transposer('Am', 'Dm')
    expectations = {
      'Am': 'Dm', 'Bm7(b5)': 'Em7(b5)', 'E7': 'A7', 'A7': 'D7',
      'Dm6': 'Gm6', 'G#m7(b5)': 'C♯m7(b5)'
    }
    expect(transposer.transpose(chord)).toEqual(transposed) for chord, transposed of expectations

  it 'transposes inverted chords', ->
    transposer = new Transposer('C', 'F')
    expectations = { 'Cm7/B♭': 'Fm7/E♭', 'A7/C♯': 'D7/F♯', 'Dm7/C': 'Gm7/F' }
    expect(transposer.transpose(chord)).toEqual(transposed) for chord, transposed of expectations

