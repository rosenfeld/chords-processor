import Parser from '../parsers/chord_parser.js';

export default class SourceTransposer {
  constructor(source, to) {
    this.source = source;
    this.to = to;
    this.transposer = new Parser(source).transposeTo(to).transposer;
  }

  transposedSource() {
    const regex = /\[([A-G].*?)\]/g;
    let dest = this.source;
    let m;
    // eslint-disable-next-line no-cond-assign
    while (m = regex.exec(this.source)) {
      dest = dest.replace(m[0], `[__${this.transposer.transpose(m[1])}__]`);
    }
    dest = dest.replace(/\[__/g, '[');
    dest = dest.replace(/__\]/g, ']');
    m = /({\s*?tone\s*?:\s*?)([A-G][b#♭♯]?)(.*?})/.exec(dest);
    return dest
      .replace(m[0], `${m[1]}${this.transposer.transpose(m[2])}${m[3]}`)
      .replace(/♯/g, '#').replace(/♭/g, 'b');
  }
}
