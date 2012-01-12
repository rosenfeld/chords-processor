Parser = require('../../lib/parsers/chord_parser').Parser
describe "Parser", ->
  it "splits the lyrics from chords in rows and columns", ->
    example = """Ó pas[A7M]tora dos [Cº]olhos cas[Bm7]tanhos
    [E7]Sempre a guardar teus re[A7M]banhos [E7(#5)]
    
    À tardinha tu [Bm7(b5)]voltas e as [E7]tranças tu [F7]soltas 
    Ao vento que te [E7]beija [Am]"""
    #expect(new Parser(example).parse()).toEqual([
    results = new Parser(example).parse()
    [
      {
        chords: ['', 'A7M', 'Cº', 'Bm7'],
        lyrics: ['Ó pas', 'tora dos ', 'olhos cas', 'tanhos']
      },
      {
        chords: ['E7', 'A7M', 'E7(♯5)'],
        lyrics: ['Sempre a guardar teus re', 'banhos ', '']
      },
      {
        chords: undefined,
        lyrics: ['']
      },
      {
        chords: ['', 'Bm7(♭5)', 'E7', 'F7'],
        lyrics: ['À tardinha tu ', 'voltas e as ', 'tranças tu ', 'soltas']
      },
      {
        chords: ['', 'E7', 'Am'],
        lyrics: ['Ao vento que te ', 'beija ', '']
      },
    ].forEach (entry, i) ->
      expect(results[i].lyrics).toEqual(entry.lyrics)
      expect(results[i].chords).toEqual(entry.chords)
