(function() {
  var decodePath, fetchSongListFromGithub, processSong, renderGithubSongsList, replaceSong, setupGithubIntegration;

  $(function() {
    $('#customize').click(function() {
      return $('#stylesheet').dialog({
        width: '800px'
      });
    });
    $('#inplace-edit').on('change', function() {
      return $('#input-container').toggle(this.checked);
    });
    $('#stylesheet textarea').on('change keyup', function() {
      return $('#songstyle').text($(this).val());
    }).change();
    $('#input').on('change keyup mouseup input', function() {
      return $('#song').html(processSong($(this).val()));
    }).change();
    return setupGithubIntegration();
  });

  processSong = function(input) {
    return new HtmlFormatter(new Parser(input).parse()).format();
  };

  setupGithubIntegration = function() {
    $('#fetch-from-github').click(function() {
      return $('#github-dialog').dialog({
        modal: true,
        width: '90%',
        height: 500
      });
    });
    return $('#github-get-songs-list-button').click(fetchSongListFromGithub);
  };

  fetchSongListFromGithub = function() {
    var repo, user;
    user = $('#github-userid').val();
    repo = $('#github-repositoryid').val();
    return $.getJSON("https://api.github.com/repos/" + user + "/" + repo + "/git/trees/master?recursive=1&callback=?", renderGithubSongsList);
  };

  renderGithubSongsList = function(response) {
    var container, tree;
    $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining']);
    tree = response.data.tree;
    container = $('#github-songs-list').empty();
    return tree.forEach(function(item) {
      var itemName;
      if (item.type !== 'blob') return;
      itemName = decodePath(item.path).replace(/^\"/, '').replace(/\"$/, '');
      return $('<a href="#"/>').text(itemName).appendTo(container).click(function() {
        return $.getJSON("" + item.url + "?callback=?", replaceSong);
      });
    });
  };

  decodePath = function(path) {
    return decodeURI(escape(path.replace(/\\(\d{3})\\(\d{3})/g, function(_, oct1, oct2) {
      return String.fromCharCode(parseInt("0" + oct1), parseInt("0" + oct2));
    })));
  };

  replaceSong = function(response) {
    var base64Content;
    $('#remaining-github-requests').text(response.meta['X-RateLimit-Remaining']);
    base64Content = response.data.content;
    $('#input').val(decode(base64Content)).change();
    return $('#github-dialog').dialog('close');
  };

}).call(this);
