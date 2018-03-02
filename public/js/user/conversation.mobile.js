var maxFileSize = 0;
function getConversation(url) {
  var path = window.location.pathname;
  var splitter = path.split('/');
  var id = splitter[splitter.length - 1];

  var data = {'id': id};

  $.ajax({
    url: url,
    type: 'GET',
    data: data
  }).done(function(response) {
    var obj = $.parseJSON(response);

    var source = $("#conversation-template").html();
    var template = Handlebars.compile(source);
    var html = template(obj);

    avatar = obj.avatar;
    maxFileSize = obj.max_file_size;
    $('#conversation').html(html);
    $('#conversationWith').val(id);
    $('#recipient_name').text(obj.recipient_name);

      if(obj.disableReply == 1) {
          $('#send-message-input').attr('contenteditable', false);
          $('#send_message').hide();
      } else {
          $('#send-message-input').attr('contenteditable', true);
          $('#send_message').show();
      }

      scrollToBottom();
    return false;
  });
}

function validateRequest(){
  var msgText = $('#send-message-input').val();
    if(msgText == ''){
      var alertDivRef = $('.alert');
      alertDivRef.removeClass("alert alert-danger hide").addClass('alert alert-danger');
      return false;
    }
    return true;
}

function onFinish() {

  if($('.alert:visible')){
    $('.alert').addClass('alert alert-danger hide');
  }
$('#msgSubmitBtn').prop('disabled',false);

  var text = $('#send-message-input').val();
  $('#send-message-input').val('');

  var dateText = new Date().toISOString();
  dateText = dateText.slice(0, -1);

  var obj = {messages: [{
        type: 'from',
        picture: avatar,
        text: text,
        date: {date: dateText}
      }]
  };

  var source = $("#conversation-template").html();
  var template = Handlebars.compile(source);
  var html = template(obj);

  $('#conversation').append(html);
}

$(function() {
  var options = {
    beforeSubmit: validateRequest,
    success: onFinish,
    url: postMessageURI
  };
  $('#sendMessageForm').ajaxForm(options);

  Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a === b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  Handlebars.registerHelper('datePrint', function(date) {
    var dateTime = date.date + ' Z';
    return moment(dateTime).format('ll');
  });
    Handlebars.registerHelper('datePrint1', function(dateObj) {
        var dateTime = dateObj.date + ' Z';
        return moment(dateTime).format('h:mm a MM/DD/YYYY');
    });
    $('#imageUpload').on('click', function() {
        $('#sendMessage_file').trigger('click');
        return false;
    });

    $(document).on('click', '.attachedImage', function() {
        $('#imagePreview').attr('src', $(this).prop('src'));
        $('div#caption').hide();
        $('#previewImageModal').modal('show');
    });

    $(document).on('click', '#addToMessage', function() {
        var captionText = $('#captionText').val();

        $('#send-message-input').text(captionText);
        $('#send-message-input').attr('contenteditable', false);
        $('#message-loading').show();
        $('#captionText').val('');
        $('#imagePreview').attr('src', '');
        sendMessage(1);
    });

    $('#send_message').on('click', function() {
        $('#message-loading').show();
        $('#send-message-input').attr('contenteditable', false);
        sendMessage(0);
    });
});
function sendMessage( hasFile ) {
    var messageText = $('#send-message-input').text();
    var sendTo      = $('#conversationWith').val();
    var data        = {'message': messageText, 'sendTo': sendTo, 'isBroadcast': 0};

    if( hasFile !== 1 ) {
        data.sendMessageFile = '';
    } else {
        data.sendMessageFile = $('#base64Image').val();
    }

    $.ajax({
        url: sendMessageUrl,
        method: 'POST',
        data: data
    }).done(function(response) {
        var responseObj   = $.parseJSON(response);
        var recipients    = sendTo.split(',');
        var lastRecipient = recipients[(recipients.length) - 1];

        $('#send-message-input').attr('contenteditable', true);
        $('#send-message-input').text('');

        if(responseObj.status == 1) {
            var source   = $("#send-message-template").html();
            var template = Handlebars.compile(source);
            var html     = template(responseObj);
            $('#message-center').find('#conversation').append(html);
            console.log($('#message-center').css('height'));
            if($('#conversation').find('.convo:last-child').find('.attachedImage').length > 0) {
                checkImageLoad();
            } else {
                scrollToBottom();
                $('#message-loading').hide();
            }
        } else {
            $('#user-header').html('<span class="help-inline">'+responseObj.message+'</span>');
            $('#user-header').show();
        }
    });
}

function scrollToBottom() {
    var top = $('#send-message-input').offset().top;

    $('html,body').animate({
        scrollTop: top
    }, 1000);
}

function checkImageLoad() {
    setTimeout(function() {
        $('#conversation').find('.convo:last-child').find('.attachedImage').load(function() {
            scrollToBottom();
            $('#message-loading').hide();
            return false;
        });

        checkImageLoad();
    }, 1000);
}

function handleFiles(fileInput) {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        var fileSize  = (file.size)/(1000*1000);

        if (!file.type.match(imageType)) {
            $('#user-header').html('<span class="help-inline">Unsupported file. Please upload Image file only.</span>');
            $('#user-header').show();
            continue;
        }

        if(fileSize > maxFileSize) {
            $('#user-header').html('<span class="help-inline">File size is too large. Please upload Image files with size less than 10MB.</span>');
            $('#user-header').show();
            continue;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').attr('src', e.target.result);
            $('#base64Image').val(e.target.result);
        };

        reader.readAsDataURL(file);

        $('div#caption').show();
        $('#previewImageModal').modal('show');
    }
}
