(function() {
  var HtmlFormatter;

  (typeof window !== "undefined" && window !== null ? window : exports).HtmlFormatter = HtmlFormatter = (function() {

    function HtmlFormatter(parsedInput) {
      this.parsedInput = parsedInput;
    }

    HtmlFormatter.prototype.format = function() {
      this.output = '';
      this.attributes = this.parsedInput.attributes;
      if (this.attributes.title) this.addTitle();
      if (this.attributes.author) this.addAuthor();
      if (this.attributes.artist) this.addArtist();
      if (this.attributes.tone) this.addTone();
      return this.output += this.parsedInput.lines.map(this.formatEntry).join('\n');
    };

    HtmlFormatter.prototype.formatEntry = function(entry) {
      var lyric;
      if (!entry.chords) {
        lyric = entry.lyrics[0];
        if (lyric) {
          return "<div class=lyrics>" + lyric + "</div>";
        } else {
          return "<br/>";
        }
      }
      return '<table class=chords><tr class=chords><th>' + entry.chords.join('</th><th>') + '</th></tr><tr class=lyrics><td>' + entry.lyrics.join('</td><td>') + '</td></tr></table>';
    };

    HtmlFormatter.prototype.addTitle = function() {
      return this.output += "<h1 class=title>" + this.attributes.title + "</h1>\n";
    };

    HtmlFormatter.prototype.addAuthor = function() {
      return this.output += "<h2 class=author>" + this.attributes.author + "</h2>\n";
    };

    HtmlFormatter.prototype.addArtist = function() {
      return this.output += "<h2 class=artist>" + this.attributes.artist + "</h2>\n";
    };

    HtmlFormatter.prototype.addTone = function() {
      return this.output += "<h2 class=tone>" + this.attributes.tone + "</h2>\n";
    };

    return HtmlFormatter;

  })();

}).call(this);
