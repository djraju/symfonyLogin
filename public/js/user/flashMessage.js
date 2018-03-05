function addFlashMessage(msg) {
  $('#the_container').prepend('<div class="flash-message">' + msg + '</div>');
}

function addAlertMessage(msg) {
  $('#the_container').prepend('<div class="alert alert-danger alert-dismissable center"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div style="text-align:left;">' + msg + '</div></div>');
}

