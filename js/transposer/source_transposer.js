(function() {
  var Parser, SourceTransposer;

  Parser = (typeof window !== "undefined" && window !== null ? window.Parser : void 0) || require('../parsers/chord_parser').Parser;

  (typeof window !== "undefined" && window !== null ? window : exports).SourceTransposer = SourceTransposer = (function() {

    function SourceTransposer(source, to) {
      this.source = source;
      this.to = to;
      this.transposer = new Parser(this.source).transposeTo(this.to).transposer;
    }

    SourceTransposer.prototype.transposedSource = function() {
      var dest, m, regex;
      regex = /\[([A-G].*?)\]/g;
      dest = this.source;
      while (m = regex.exec(this.source)) {
        dest = dest.replace(m[0], "[" + (this.transposer.transpose(m[1])) + "]");
      }
      m = /({\s*?tone\s*?:\s*?)([A-G])(.*?})/.exec(dest);
      return dest.replace(m[0], "" + m[1] + (this.transposer.transpose(m[2])) + m[3]).replace(/♯/g, '#').replace(/♭/g, 'b');
    };

    return SourceTransposer;

  })();

}).call(this);
