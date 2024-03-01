export default class HtmlFormatter {
  constructor(parsedInput) {
    this.parsedInput = parsedInput;
  }

  format() {
    this.output = '';
    this.attributes = this.parsedInput.attributes;
    if (this.attributes.title) this.addTitle();
    if (this.attributes.author) this.addAuthor();
    if (this.attributes.artist) this.addArtist();
    if (this.attributes.tone) this.addTone();
    this.output += this.parsedInput.lines.map(formatEntry).join('\n');
    return this.output;
  }

  addTitle() { this.output += `<h1 class=title>${this.attributes.title}</h1>\n`; }

  addAuthor() { this.output += `<h2 class=author>${this.attributes.author}</h2>\n`; }

  addArtist() { this.output += `<h2 class=artist>${this.attributes.artist}</h2>\n`; }

  addTone() { this.output += `<h2 class=tone>${this.attributes.tone}</h2>\n`; }
}

function formatEntry(entry) {
  if (!entry.chords) {
    const lyric = entry.lyrics[0];
    return lyric ? `<div class=lyrics>${lyric}</div>` : '<br/>';
  }
  let normalizedTr = '';
  if (entry.normalized) {
    normalizedTr = '<tr class="normalized-chords chords-common"><th>'
    + `${entry.normalized.join('</th><th>')}</th></tr>`;
  }
  return `<table class=chords>${normalizedTr}`
  + '<tr class="chords chords-common">'
  + `<th>${entry.chords.join('</th><th>')}</th>`
  + '</tr>'
  + '<tr class=lyrics>'
  + `<td>${entry.lyrics.join('</td><td>')}</td>`
  + '</tr>'
  + '</table>';
}
