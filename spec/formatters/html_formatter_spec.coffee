HtmlFormatter = require('../../lib/formatters/html_formatter').HtmlFormatter
Parser = require('../../lib/parsers/chord_parser').Parser
describe "HtmlFormatter", ->
  it "formats a chord formatted input to HTML", ->
    example = """Ó pas[A7M]tora dos [Cº]olhos cas[Bm7]tanhos
    [E7]Sempre a guardar teus re[A7M]banhos [E7(#5)]

    Bis

    À tardinha tu [Bm7(b5)]voltas e as [E7]tranças tu [F7]soltas
    Ao vento que te [E7]beija [Am]"""
    input = new Parser(example).parse()
    expect(new HtmlFormatter(input).format()).toEqual(
      '<table class=chords><tr class=chords><th></th><th>A7M</th><th>Cº</th><th>Bm7</th></tr>' +
      "<tr class=lyrics><td>Ó pas</td><td>tora dos </td><td>olhos cas</td><td>tanhos</td></tr></table>\n" +
      '<table class=chords><tr class=chords><th>E7</th><th>A7M</th><th>E7(♯5)</th></tr>' +
      "<tr class=lyrics><td>Sempre a guardar teus re</td><td>banhos </td><td></td></tr></table>\n" +
      "<br/>\n" +
      "<div class=lyrics>Bis</div>\n" +
      "<br/>\n" +
      '<table class=chords><tr class=chords><th></th><th>Bm7(♭5)</th><th>E7</th><th>F7</th></tr>' +
      "<tr class=lyrics><td>À tardinha tu </td><td>voltas e as </td><td>tranças tu </td><td>soltas</td></tr></table>\n" +
      '<table class=chords><tr class=chords><th></th><th>E7</th><th>Am</th></tr>' +
      "<tr class=lyrics><td>Ao vento que te </td><td>beija </td><td></td></tr></table>"
    )

  it "formats title, author, artist and tone", ->
    songInfo = """
      {title: Pastora dos Olhos Castanhos}
      {author: Horondino Silva e Alberto Ribeiro}
      {artist: Paulinho da Viola}
      {tone: A}
    """
    input = new Parser(songInfo).parse()
    expect(new HtmlFormatter(input).format()).toEqual("""
<h1 class=title>Pastora dos Olhos Castanhos</h1>
<h2 class=author>Horondino Silva e Alberto Ribeiro</h2>
<h2 class=artist>Paulinho da Viola</h2>
<h2 class=tone>A</h2>
<br/>
    """)
