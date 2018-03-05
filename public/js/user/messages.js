function showConversation() {
  return function() {
      $('.conversation').hide();
      $('.preview').removeClass('activeConversation');
      $(this).addClass('activeConversation');

      $('#user-header').html('');
      $('#user-header').html($(this).html());
      $('#user-header').find('.msg').remove();
      $('#user-header').find('.date').remove();
      $('#user-header').find('.unread').remove();

      $('#noActiveConversation').hide();
      $('#hasActiveConversation').show();

      var previewId = $(this).prop('id');
      var id = previewId.split('preview')[1];

      fetchMessagesForRecipient(id, previewId);

      $('#sendMessage_id').val(id);
      $(this).find('.unread').hide();

      markAsRead(id);
  };
}

function fetchMessagesForRecipient(recipientId, previewId) {
    var data = {'id': recipientId};

    $.ajax({
        url: fetchMessageURI,
        data: data,
        type: 'POST'
    }).done(function(response) {
        var obj      = $.parseJSON(response);
        var source   = $("#message-template").html();
        var template = Handlebars.compile(source);
        var html     = template(obj);
        $('#message-center').html(html);

        $('.convo-wrapper').css({'overflow': 'hidden'});
        setTimeout(function() {
            $('.convo-wrapper').css({'overflow-y': 'auto'});
            $(".convo-wrapper").animate({ scrollTop: $('.convo-wrapper').prop("scrollHeight")}, 5);
            $('#message-loading').hide();
        }, 200);

        if(previewId !== 'undefined') {
            if($('#'+previewId).parent().attr('id') == "searchedUsers") {
                $('#'+previewId).prependTo('#conversasion');
                $('#clear-search').trigger('click');
                $('#'+previewId).show();
            }
        }

        if(obj.disableReply == 1) {
            $('#sendMessageText').attr('contenteditable', false);
        } else {
            $('#sendMessageText').attr('contenteditable', true);
        }
    });
}

function markAsRead(id) {
  var data = {'id': id};

  $.ajax({
    url: markAsReadURI,
    data: data,
    type: 'POST'
  }).done(function(response) {
    var obj = $.parseJSON(response);
    $('#messages_tab b').html('(' + obj.totalUnread + ')');
  });
}

$(function() {
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

    Handlebars.registerHelper('decodeHtmlStr', function(inputData) {
        return new Handlebars.SafeString(inputData);
    });

    $('.conversation').hide();
    $('#sendMessage_id').hide();

    // add click handlers to all previews
    $('.preview').each(function() {
        $(this).click(showConversation());
    });

    if (typeof id !== 'undefined') {
        $('#preview' + id).click();
    } else {
        if($('.preview').first().hasClass('messaged')) {
            $('.preview').first().click();
        } else if(!isPatient) {
            $('#noActiveConversation').show();
            $('#hasActiveConversation').hide();
        } else {
            $('#noActiveConversation').hide();
            $('#hasActiveConversation').show();
            $('#conversasion').find('.preview').each(function() {
                $(this).show();
            });
            $('.preview').first().click();
        }
    }

    $('#imageUpload').on('click', function() {
        $('#sendMessage_file').trigger('click');
        return false;
    });

    $(document).on('click', '#broadcastImageUpload', function() {
        var receiverCounter = 0;
        $('#broadcast_recepients').find('.receiver').each(function() {
            if( $(this).hasClass('fa-check-square-o') ) {
                receiverCounter++;
            }
        });

        if(receiverCounter > 0) {
            $('#sendBroadcastMessage_file').trigger('click');
        } else {
            $('#broadcast_header').html('');
            $('#broadcast_header').html('<span class="help-inline">Please select at least one user</span>');
        }

        return false;
    });

    $('#search').on('keyup', function() {
        var searchText  = (($(this).val()).trim()).toLowerCase();
        if(searchText != "" && searchText.length > 2) {
            var searchedRecipients = {};
            var recipients         = {};
            $.each(recipientJSON, function(id, values) {
                if(((values.name).toLowerCase()).indexOf(searchText) !== -1) {
                    searchedRecipients[id] = values;
                }
            });
            recipients.patients = searchedRecipients;

            var source   = $("#recepient-template").html();
            var template = Handlebars.compile(source);
            var html     = template(recipients);
            $('#searchedUsers').html(html);
            $('.preview').each(function() {
                $(this).click(showConversation());
            });
        } else {
            $('#searchedUsers').html('');
            $('#conversasion').find('.preview').each( function() {
                if($(this).hasClass('messaged')) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });
    $('#receiver_search').on('keyup', function() {
        var searchText  = $(this).val();
        if(searchText != "") {
            searchText = searchText.toLowerCase();
            $('#broadcast_recepients').find('.broadcast_preview').each( function() {
                var pName = ( $(this).find('span.name').text() ).toLowerCase();
                if( pName.indexOf(searchText) >= 0 ) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('#broadcast_recepients').find('.broadcast_preview').each( function() {
                $(this).show();
            });
        }
    });
    $('#clear-search').on('click', function() {
        $('#search').val('');
        $('#searchedUsers').html('');
        $('#conversasion').find('.preview').each( function() {
            if($(this).hasClass('messaged')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    $('#brodcast-clear-search').on('click', function() {
        $('#receiver_search').val('');
        $('#broadcast_recepients').find('.broadcast_preview').each( function() {
            $(this).show();
        });
    });

    $('#select-button').on('click', function() {
        $('#broadcast_recepients').find('.receiver').each( function() {
            if($(this).hasClass('fa-square-o')) {
                $(this).removeClass('fa-square-o');
                $(this).addClass('fa-check-square-o');
            }
        });
        $('#broadcast_header').html('');
    });
    $('#clear-button').on('click', function() {
        $('#broadcast_recepients').find('.receiver').each( function() {
            if($(this).hasClass('fa-check-square-o')) {
                $(this).addClass('fa-square-o');
                $(this).removeClass('fa-check-square-o');
            }
        });
    });

    $("#sendMessageText").keydown(function(e){
        if (e.keyCode == 13 && !e.shiftKey) {
            var textareaData    = $(this).text().replace(/\s/g, '');
            if(textareaData.length > 0) {
                $(this).attr('contenteditable', false);
                $('#message-loading').show();
                sendMessage(0, 0);
                return false;
            } else {
                return false;
            }
        }

        if (e.keyCode == 8) {
            var divHeight = ($(this).css('height')).slice(0, -2);
            if (divHeight > 20) {
                var mainDivTop = ($('#main-message-div').css('margin-top')).slice(0, -2);
                $('#main-message-div').css('margin-top', (parseInt(mainDivTop)+5)+'px');
            }
        }
    });
    $(document).on('keydown', "#sendBroadcastMessageText", function(e){
        if (e.keyCode == 13 && !e.shiftKey) {
            var textareaData    = $(this).text().replace(/\s/g, '');
            var receiverCounter = 0;

            $('#broadcast_recepients').find('.receiver').each(function() {
                if( $(this).hasClass('fa-check-square-o') ) {
                    receiverCounter++;
                }
            });

            if( receiverCounter > 0 ) {
                if((textareaData).length > 0) {
                    $('#broadcast_header').html('');
                    $(this).attr('contenteditable', false);
                    $('#broadcast_message_loading').show();
                    sendMessage(1, 0);
                    return false;
                } else {
                    return false;
                }
            } else {
                $('#broadcast_header').html('');
                $('#broadcast_header').html('<span class="help-inline">Please select at least one user</span>');
                return false;
            }
        }

        if (e.keyCode == 8) {
            var divHeight = ($(this).css('height')).slice(0, -2);
            if (divHeight > 20) {
                var mainDivTop = ($('#broadcastModal').css('margin-top')).slice(0, -2);
                $('#broadcastModal').css('margin-top', (parseInt(mainDivTop)+5)+'px');
                $('#broadcastModal').css('padding-top', (parseInt(mainDivTop)+5)+'px');
            }
        }
    });

    $('#broadcast-modal, #broadcast-modal1').on('click', function() {
        loadNewBroadcastMessage();
    });

    $(document).on('click', '.receiver', function() {
        if($(this).hasClass('fa-square-o')) {
            $(this).removeClass('fa-square-o');
            $(this).addClass('fa-check-square-o');
            $('#broadcast_header').html('');
            var receiver = $(this).attr('id');
            $('#sendBroadcastMessage_id input[type=checkbox]').each( function() {
                if( $(this).val() == receiver ) {
                    $(this).attr('checked', 'checked');
                }
            });
        } else if( $(this).hasClass('fa-check-square-o') ) {
            $(this).removeClass('fa-check-square-o');
            $(this).addClass('fa-square-o');
            var receiver = $(this).attr('id');
            $('#sendBroadcastMessage_id input[type=checkbox]').each( function() {
                if( $(this).val() == receiver ) {
                    $(this).removeAttr('checked', 'checked');
                }
            });
        }
    });

      $(document).on('click', '#addToMessage', function() {
          sendMessageWithImage();
      });

        $(document).on('keydown', "#captionText", function(e){
            if (e.keyCode == 13) {
                sendMessageWithImage();
            }
        });

      $(document).on('click', '.attachedImage', function() {
          $('#imagePreview').attr('src', $(this).prop('src'));
          $('div#caption').hide();
          $('#previewImageModal').modal('show');
      });

      $(document).on('change', '#providers', function() {
          var providerId = $(this).val();
          fetchPatients(providerId);
      });
});

function sendMessage( isBroadcast, hasFile ) {
    var messageText = $('#sendMessageText').html();
    var sendTo      = $('#sendMessage_id').val();

    if(isBroadcast === 1) {
        messageText = $('#sendBroadcastMessageText').text();
        receipients = '';
        $('#broadcast_recepients').find('.receiver').each(function() {
            if( $(this).hasClass('fa-check-square-o') ) {
                receipients += this.id+',';
            }
        });
        sendTo = receipients.slice(0, -1);
    }

    var data  = {'message': messageText, 'sendTo': sendTo, 'isBroadcast': isBroadcast};
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

        if( isBroadcast === 1) {
            $('#sendBroadcastMessageText').attr('contenteditable', true);
            $('#broadcast_message_loading').hide();
            $('#sendBroadcastMessageText').text('');
            $('#broadcastModal').modal('hide');
        } else {
            var divHeight = ($('#sendMessageText').css('height')).slice(0, -2);
            if (divHeight > 36) {
                var mainDivTop = ($('#main-message-div').css('margin-top')).slice(0, -2);
                $('#main-message-div').css('margin-top', (parseInt(mainDivTop)+(parseInt(divHeight)-36))+'px');
            }

            $('#sendMessageText').attr('contenteditable', true);
            $('#sendMessageText').text('');
        }

        if(responseObj.status == 1) {
            var source   = $("#send-message-template").html();
            var template = Handlebars.compile(source);
            var html     = template(responseObj);
            $('#message-center').find('#conversation').append(html);

            if($('#conversation').find('.convo:last-child').find('.attachedImage').length > 0) {
                checkImageLoad();
            } else {
                $(".convo-wrapper").animate({ scrollTop: parseInt($('.convo-wrapper').prop("scrollHeight"))}, 1000);
                $('#message-loading').hide();
            }

            $('.preview').each(function() {
                if(this.id == 'preview'+lastRecipient) {
                    if(messageText.length > 40) {
                        messageText = messageText.substring(0, 40) + "...";
                    }
                    $(this).find('.messagePreview').html(messageText);
                    $(this).addClass('messaged');
                    $(this).prependTo('#conversasion');
                    $(this).show();
                }
            });
        } else {
            $('#message_error').html('<span class="help-inline">'+responseObj.message+'</span>');
        }
    });
}

function checkImageLoad() {
    setTimeout(function() {
        $('#conversation').find('.convo:last-child').find('.attachedImage').load(function() {
            var imageHeight = $('#conversation').find('.convo:last-child').find('.attachedImage').css('height').slice(0, -2);
            var wrapperHeight = $(".convo-wrapper").css('height').slice(0, -2);
            $(".convo-wrapper").css('height', (parseInt(imageHeight)+parseInt(wrapperHeight)));
            $(".convo-wrapper").animate({ scrollTop: parseInt($('.convo-wrapper').prop("scrollHeight"))}, 1000);
            $('#message-loading').hide();
            return false;
        });

        checkImageLoad();
    }, 1000);
}

function loadNewBroadcastMessage() {
    if(isProvider || isAdmin) {
        if(getProviders !== 'undefined' && getProviders == 1) {
            fetchProvidersPatients();
        } else {
            fetchPatients(currentUserId);
        }
    }

    $('#receiver_search').val("");
    $('#broadcast_recepients').find('.receiver').each(function() {
        if( $(this).hasClass('fa-check-square-o') ) {
            $(this).removeClass('fa-check-square-o');
            $(this).addClass('fa-square-o');
        }
    });

    $('#broadcastModal').modal('show');
}

function handleFiles(fileInput, isBroadcast) {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file      = files[i];
        var imageType = /image.*/;
        var fileSize  = (file.size)/(1000*1000);

        if (!file.type.match(imageType)) {
            $('#message_error').html('<span class="help-inline">Unsupported file. Please upload Image file only.</span>');
            continue;
        }

        if(fileSize > maxFileSize) {
            $('#message_error').html('<span class="help-inline">File size is too large. Please upload Image files with size less than 10MB.</span>');
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

        if( isBroadcast !== 'undefined' && isBroadcast === 1) {
            $('#messageType').val('broadcastMessage');
        }
    }
}

function fetchProvidersPatients() {
    $.ajax({
        url: fetchProvidersPatientsUrl,
        method: 'POST',
        data: ''
    }).done(function(response) {
        var obj = $.parseJSON(response);
        var source   = $("#patient-template").html();
        var template = Handlebars.compile(source);
        var html     = template(obj);
        $('#broadcast_recepients').html(html);

        var source   = $("#provider-template").html();
        var template = Handlebars.compile(source);
        var html     = template(obj);
        $('#providers').html(html);
    });
}

function fetchPatients(providerId) {
    $.ajax({
        url: fetchPatientsUrl,
        method: 'POST',
        data: {'providerId': providerId}
    }).done(function(response) {
        var obj = $.parseJSON(response);
        var source   = $("#patient-template").html();
        var template = Handlebars.compile(source);
        var html     = template(obj);
        $('#broadcast_recepients').html(html);
    });
}

function sendMessageWithImage() {
    var isBroadcastMessage = $('#messageType').val();
    var captionText = $('#captionText').val();
    if (isBroadcastMessage == "") {
        $('#sendMessageText').text(captionText);
        $('#sendMessageText').attr('contenteditable', false);
        $('#message-loading').show();
        $('#captionText').val('');
        $('#imagePreview').attr('src', '');
        sendMessage(0, 1);
    } else {
        $('#sendBroadcastMessageText').text(captionText);
        $('#sendBroadcastMessage_text').attr('contenteditable', false);
        $('#broadcast_message_loading').show();
        sendMessage(1, 1);
    }

    $('#previewImageModal').modal('toggle');
}

