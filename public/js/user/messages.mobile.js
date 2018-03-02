function getRecipients(url) {
  $.ajax({
    url: url,
    type: 'GET'
  }).done(function(response) {
    var obj = $.parseJSON(response);
    obj['getMessagesURI'] = getMessagesURI;

    var source = $("#recipients-template").html();
    var template = Handlebars.compile(source);
    var html = template(obj);

    $('#recipients').html(html);
  });
}

$(function() {
    getRecipients(getRecipientsURI);
    $('#send_message').on('click', function() {
        var messageText = $('#send-message-input').val();
        if(messageText != "") {
            $('#sendMessageForm').submit();
        }
    });
});
