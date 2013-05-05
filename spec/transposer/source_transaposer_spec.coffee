SourceTransposer = require('../../lib/transposer/source_transposer').SourceTransposer

describe 'SourceTransposer', ->
  it "transposes the source-code without formatting it", ->
    example = """{tone: A}
    Oh pas[A7M]tora dos [Cº]olhos cas[Bm7]tanhos
    [E7]Sempre a guardar teus re[A7M]banhos [E7(#5)]

    Bis

    À tardinha tu [Bm7(b5)]voltas e as [E7]tranças tu [F7]soltas
    Ao vento que te [E7]beija [Am]"""

    transposed = new SourceTransposer(example, 'C').transposedSource()
    expect(transposed).toEqual("""{tone: C}
      Oh pas[C7M]tora dos [Ebº]olhos cas[Dm7]tanhos
      [G7]Sempre a guardar teus re[C7M]banhos [G7(#5)]

      Bis

      À tardinha tu [Dm7(b5)]voltas e as [G7]tranças tu [Ab7]soltas
      Ao vento que te [G7]beija [Cm]"""
    )

    transposed = new SourceTransposer(example, 'Bb').transposedSource()
    expect(transposed).toEqual("""{tone: Bb}
      Oh pas[Bb7M]tora dos [Dbº]olhos cas[Cm7]tanhos
      [F7]Sempre a guardar teus re[Bb7M]banhos [F7(#5)]

      Bis

      À tardinha tu [Cm7(b5)]voltas e as [F7]tranças tu [Gb7]soltas
      Ao vento que te [F7]beija [Bbm]"""
    )
