$(function() {
  var d = document, s = 'script', id = 'facebook-jssdk',
      js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "http://connect.facebook.net/pt_BR/all.js#xfbml=1&appId=275755052476480";
  fjs.parentNode.insertBefore(js, fjs);
});
