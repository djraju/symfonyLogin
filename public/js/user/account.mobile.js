function getAccountInfo( url ) {
  $.ajax({
      url: url,
      type: 'GET'
  }).done(function(response) {
      var obj = $.parseJSON(response);
      
      var source = $("#account-template").html();
      var template = Handlebars.compile(source);
      var html = template(obj);

      $('#user_account').html(html);
  });
}
