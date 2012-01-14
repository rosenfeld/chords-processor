(function() {
  var ACCIDENTS, INVERTED_REGEX, NORMALIZED, NOTES, Transposer;

  NOTES = ['A', ['B♭', 'A♯'], 'B', 'C', ['D♭', 'C♯'], 'D', ['E♭', 'D♯'], 'E', 'F', ['G♭', 'F♯'], 'G', ['A♭', 'G♯']];

  NORMALIZED = ['I', 'I♯', 'II', 'III♭', 'III', 'IV', 'IV♯', 'V', 'VI♭', 'VI', 'VII♭', 'VII'];

  ACCIDENTS = [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];

  INVERTED_REGEX = /(\/\s*)([A-G][#♯b♭]?)\s*$/;

  (typeof window !== "undefined" && window !== null ? window : exports).Transposer = Transposer = (function() {

    function Transposer(from, to) {
      var _ref, _ref2, _ref3;
      this.from = from;
      this.to = to;
      if (this.from) {
        _ref = this.from.slice(0, 2), this.tone = _ref[0], this.accident = _ref[1];
        if ((_ref2 = this.accident) !== '#' && _ref2 !== '♯' && _ref2 !== 'b' && _ref2 !== '♭') {
          this.accident = null;
        }
        this.minor = this.from[(_ref3 = this.accident === null) != null ? _ref3 : {
          1: 2
        }] === 'm';
        this.absolute = this.absoluteIdx(this.from);
      }
      if (this.to) {
        this.delta = this.relativeIdx(this.to);
        this.toTransposer = new Transposer(this.to);
      }
    }

    Transposer.prototype.absoluteIdx = function(chord) {
      var accident, idx, letter, _ref;
      _ref = chord.slice(0, 2), letter = _ref[0], accident = _ref[1];
      idx = NOTES.indexOf(letter);
      if (accident === '#' || accident === '♯') idx += 1;
      if (accident === 'b' || accident === '♭') idx -= 1;
      if (idx === -1) idx = 11;
      return idx;
    };

    Transposer.prototype.relativeIdx = function(chord) {
      var idx;
      idx = this.absoluteIdx(chord) - this.absoluteIdx(this.tone);
      if (idx < 0) idx += 12;
      return idx;
    };

    Transposer.prototype.normalize = function(chord) {
      var _this = this;
      chord = chord.replace(/^[A-G][#♯b♭]?/, NORMALIZED[this.relativeIdx(chord)]);
      return chord.replace(INVERTED_REGEX, function(_, prefix, inversion) {
        return prefix + _this.normalize(inversion);
      });
    };

    Transposer.prototype.transpose = function(chord) {
      var newIdx, remaining, ridx, transposed;
      var _this = this;
      newIdx = this.relativeIdx(chord) + this.delta + this.absolute;
      while (newIdx >= 12) {
        newIdx -= 12;
      }
      remaining = chord.replace(/^[A-G][b#♭♯]?/, '');
      transposed = NOTES[newIdx];
      if (transposed[1]) {
        ridx = this.toTransposer.relativeIdx(transposed[0]);
        transposed = transposed[ACCIDENTS[ridx]];
      }
      remaining = remaining.replace(INVERTED_REGEX, function(_, prefix, inversion) {
        return prefix + _this.transpose(inversion);
      });
      return transposed + remaining;
    };

    return Transposer;

  })();

}).call(this);