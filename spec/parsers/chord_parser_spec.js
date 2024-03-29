import Parser from '../../lib/parsers/chord_parser.js';

describe('Parser', () => {
  it('splits the lyrics from chords in rows and columns', () => {
    const example = `Ó pas[A7M]tora dos [Cº]olhos cas[Bm7]tanhos
    [E7]Sempre a guardar teus re[A7M]banhos [E7(#5)]
    
    À tardinha tu [Bm7(b5)]voltas e as [E7]tranças tu [F7]soltas 
    Ao vento que te [E7]beija [Am]`;
    const results = new Parser(example).parse().lines;
    [
      {
        chords: ['', 'A7M', 'Cº', 'Bm7'],
        lyrics: ['Ó pas', 'tora dos ', 'olhos cas', 'tanhos'],
      },
      {
        chords: ['E7', 'A7M', 'E7(♯5)'],
        lyrics: ['Sempre a guardar teus re', 'banhos ', ''],
      },
      {
        chords: undefined,
        lyrics: [''],
      },
      {
        chords: ['', 'Bm7(♭5)', 'E7', 'F7'],
        lyrics: ['À tardinha tu ', 'voltas e as ', 'tranças tu ', 'soltas'],
      },
      {
        chords: ['', 'E7', 'Am'],
        lyrics: ['Ao vento que te ', 'beija ', ''],
      },
    ].forEach((entry, i) => {
      expect(results[i].lyrics).toEqual(entry.lyrics);
      expect(results[i].chords).toEqual(entry.chords);
    });
  });

  it('supports key:value directives', () => {
    expect(new Parser('{tone: B}').parse().attributes.tone).toEqual('B');
    expect(new Parser('{tone:B}').parse().attributes.tone).toEqual('B');
    expect(new Parser('{ Tone :  B  }').parse().attributes.tone).toEqual('B');
  });

  it('supports transposition', () => {
    const example = `{tone: A}Ó pas[A7M]tora dos [Cº]olhos cas[Bm7]tanhos
    [E7]Sempre a guardar teus re[A7M]banhos [E7(#5)]`;
    const results = new Parser(example).transposeTo('C').parse().lines;
    /* eslint-disable key-spacing */
    [
      {
        normalized: ['', 'I7M', '♭IIIº', 'IIm7'],
        chords:     ['', 'C7M', 'E♭º', 'Dm7'],
        lyrics:     ['Ó pas', 'tora dos ', 'olhos cas', 'tanhos'],
      },
      {
        normalized: ['V7', 'I7M', 'V7(♯5)'],
        chords:     ['G7', 'C7M', 'G7(♯5)'],
        lyrics:     ['Sempre a guardar teus re', 'banhos ', ''],
      },
      /* eslint-enable key-spacing */
    ].forEach((entry, i) => {
      expect(results[i].lyrics).toEqual(entry.lyrics);
      expect(results[i].chords).toEqual(entry.chords);
      expect(results[i].normalized).toEqual(entry.normalized);
    });
  });
});
