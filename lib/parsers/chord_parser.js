import Transposer from '../transposer/transposer.js';

export default class Parser {
  constructor(source) {
    this.source = source;
  }

  parse() {
    this.processDirectives();
    if (this.attributes.tone) this.transposer ||= new Transposer(this.attributes.tone);
    return {
      lines: this.source.split('\n').map(this.processLine.bind(this)).filter((l) => l !== null),
      attributes: this.attributes,
    };
  }

  processDirectives() {
    if (this.attributes) return;
    this.attributes = {};
    this.source.match(/{.*?}/g)?.forEach((directive) => {
      const [key, value] = directive.slice(1, -1).split(':').map((d) => d.trim());
      this.attributes[key.toLowerCase()] = value;
    });
    this.source = this.source.replace(/{.*?}/g, '');
  }

  processLine(_line) {
    const line = _line.trim();
    if (line === '' && this.lastProcessedLine === '') return null;
    this.lastProcessedLine = line;
    const chordExpr = '\\[[A-G].*?\\]';
    const regex = new RegExp(chordExpr, 'g');
    const lyrics = line.split(regex);
    let chords = line.match(regex)?.map((chord) => chord.slice(1, -1).replace('b', '\u266d').replace('#', '\u266f'));
    if (new RegExp(`^${chordExpr}`).test(line)) lyrics.shift(); else chords?.unshift('');
    let normalized;
    if (chords && this.transposer) {
      normalized = chords.map((chord) => (chord ? this.transposer.normalize(chord) : ''));
      if (this.transposer.to) chords = chords.map((chord) => (chord ? this.transposer.transpose(chord) : ''));
    }
    return { chords, lyrics, normalized };
  }

  transposeTo(tone) {
    this.processDirectives();
    this.transposer = new Transposer(this.attributes.tone, tone);
    return this;
  }
}
