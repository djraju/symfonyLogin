function showResponse(response) {
  var obj = $.parseJSON(response);
  if(obj.message!=""){
    $('#imageUploadError'+obj.step).text(obj.message);
    $('#imageUploadError'+obj.step).show();
  }
  else{
    $('#exercise_step' + obj.step + '_picture').val(obj.img);
    $('#img' + obj.step).attr('src', obj.img);
    if($('#imageUploadError'+obj.step).is(":visible")){
      $('#imageUploadError'+obj.step).hide();
    }
  }
}

function setYoutubeVideo() {
  var url = $('#exercise_youtubeDemo').val();
  if( url != "" ) {
      var id = $.url(url).param('v');
      if( id ) {
          $('iframe').attr('src', 'https://www.youtube.com/embed/' + id + '?rel=0');
      } else {
          $('iframe').attr('src', 'https://www.youtube.com/embed/' + url + '?rel=0');
      }
  } else {
      $('iframe').attr('src', '');
  }
}

$(function() {
  setYoutubeVideo();

  $('#createEditExercise').areYouSure(
      {
        message: 'It looks like you have been editing something. '
        + 'If you leave before saving, your changes will be lost.'
      }
  );

  $('#exercise_step1_picture').parent().append($('#step1ImageForm'));
  $('#exercise_step2_picture').parent().append($('#step2ImageForm'));
  $('#exercise_step3_picture').parent().append($('#step3ImageForm'));

  $('#step1ImageForm input[type=file]').change(function() {
    $('#step1ImageForm').submit();
  });

  $('#step2ImageForm input[type=file]').change(function() {
      $('#step2ImageForm').submit();
      $('#exercise_step2_description').attr('required', 'required');
  });

  $('#step3ImageForm input[type=file]').change(function() {
      $('#step3ImageForm').submit();
      $('#exercise_step3_description').attr('required', 'required');
  });

  $('#exercise_youtubeDemo').change(function() {
     setYoutubeVideo();
  });

  $('#step1ImageForm').ajaxForm({
    success: showResponse,
    data: {stepNumber: '1'},
    url: upload_uri
  });

  $('#step2ImageForm').ajaxForm({
    success: showResponse,
    data: {stepNumber: '2'},
    url: upload_uri
  });

  $('#step3ImageForm').ajaxForm({
    success: showResponse,
    data: {stepNumber: '3'},
    url: upload_uri
  });

  $('#exercise_submit').click(function(e) {
      if( !validateSteps() ) {
          return false;
      }
    var checked = false;
    $('input[name="exercise[injuries][]"]').each(function(index, value) {
      if ($(value).prop('checked')) {
        checked = true;
      }
    });
    if (!checked) {
      e.preventDefault();
      alert('Please select at least one injury location.');
    }
  });
});
function validateSteps() {
    if( $('#exercise_step1_description').val() != "" && $('#exercise_step1_picture').val() == "" ) {
        $('#imageUploadError1').html('Please choose Step Picture.');
        $('#imageUploadError1').show();
        return false;
    } else {
        $('#imageUploadError1').html('ttt');
        $('#imageUploadError1').hide();
    }
    if( $('#exercise_step2_description').val() != "" && $('#exercise_step2_picture').val() == "" ) {
        $('#imageUploadError2').html('Please choose Step Picture.');
        $('#imageUploadError2').show();
        return false;
    } else {
        $('#imageUploadError2').html('ttt');
        $('#imageUploadError2').hide();
    }
    if( $('#exercise_step3_description').val() != "" && $('#exercise_step3_picture').val() == "" ) {
        $('#imageUploadError3').html('Please choose Step Picture.');
        $('#imageUploadError3').show();
        return false;
    } else {
        $('#imageUploadError3').html('ttt');
        $('#imageUploadError3').hide();
    }

    if ($('#exercise_step1_picture').val() != "" && $('#exercise_step1_description').val() == "") {
        $('#imageUploadError1').html('Please add Step Description.');
        $('#imageUploadError1').show();
        return false;
    } else {
        $('#imageUploadError1').html('ttt');
        $('#imageUploadError1').hide();
    }
    if($('#exercise_step2_picture').val() != "" && $('#exercise_step2_description').val() == "") {
        $('#imageUploadError2').html('Please add Step Description.');
        $('#imageUploadError2').show();
        return false;
    } else {
        $('#imageUploadError2').html('ttt');
        $('#imageUploadError2').hide();
    }
    if($('#exercise_step3_picture').val() != "" && $('#exercise_step3_description').val() == "") {
        $('#imageUploadError3').html('Please add Step Description.');
        $('#imageUploadError3').show();
        return false;
    } else {
        $('#imageUploadError3').html('ttt');
        $('#imageUploadError3').hide();
    }

    return true;
}
