function updatePracticeAdmins() {
  var admins = Array();

  $('input[type=checkbox]').each(function() {
    var checked = $(this).prop('checked');

    if (checked) {
      var value = $(this).val();
      admins.push(value);
    }
  });

  var data = {'admins': admins};

  $.ajax({
    url: updatePracticeAdminUri,
    data: data,
    type: 'POST'
  }).done(function() {
  });
}