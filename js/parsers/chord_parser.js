(function() {
  var Parser;

  (typeof window !== "undefined" && window !== null ? window : exports).Parser = Parser = (function() {

    function Parser(source) {
      this.source = source;
    }

    Parser.prototype.parse = function() {
      this.processDirectives();
      return {
        lines: this.source.split("\n").map(this.processLine).filter(function(l) {
          return l !== null;
        }),
        attributes: this.attributes
      };
    };

    Parser.prototype.processDirectives = function() {
      var _ref;
      var _this = this;
      this.attributes = {};
      if ((_ref = this.source.match(/{.*?}/g)) != null) {
        _ref.forEach(function(directive) {
          var key, value, _ref2;
          _ref2 = directive.slice(1, -1).split(':').map(function(d) {
            return d.trim();
          }), key = _ref2[0], value = _ref2[1];
          return _this.attributes[key.toLowerCase()] = value;
        });
      }
      return this.source = this.source.replace(/{.*?}/g, '');
    };

    Parser.prototype.processLine = function(line) {
      var chordExpr, chords, lyrics, regex, _ref;
      line = line.trim();
      if (line === '' && this.lastProcessedLine === '') return null;
      this.lastProcessedLine = line;
      chordExpr = "\\[[A-G].*?\\]";
      regex = new RegExp(chordExpr, 'g');
      lyrics = line.split(regex);
      chords = (_ref = line.match(regex)) != null ? _ref.map(function(chord) {
        return chord.slice(1, -1).replace('b', '\u266d').replace('#', '\u266f');
      }) : void 0;
      if (new RegExp("^" + chordExpr).test(line)) {
        lyrics.shift();
      } else {
        if (chords != null) chords.unshift('');
      }
      return {
        chords: chords,
        lyrics: lyrics
      };
    };

    return Parser;

  })();

}).call(this);
