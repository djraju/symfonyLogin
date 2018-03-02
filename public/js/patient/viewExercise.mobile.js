function getExerciseDetails(url) {
  var path = window.location.pathname;
  var splitter = path.split('/');
  var id = splitter[splitter.length - 1];
  var data = {'id': id};
  $.ajax({
    url: url,
    data: data,
    type: 'GET'
  }).done(function(response) {
      var obj = $.parseJSON(response);
console.log(response);
      // populate the exercises
      $('#exercise-name').text(obj.name);
      if(obj.notes === "" || obj.notes === null){
         $('#current_note_box').hide();
      }
      else{
         $('#provider').text(obj.provider);
         $('#current_note_display').text(obj.notes);
      }

      var source = $("#exercise-details-template").html();
      var template = Handlebars.compile(source);
      var html = template(obj);
      $('.workout_steps').html(html);

      if (obj.video === "" || obj.video === null) {
        $('#demoVideoContainer').hide();
      } else {
        $('#demoVideo').attr('src', 'https://www.youtube.com/embed/' + obj.video + '?rel=0');
      }

      $('#providerId').val( obj.exerciseDetails.provider );
  });
}

$(function() {
  getExerciseDetails(exerciseDetailsUrl);

  Handlebars.registerHelper('imageResize', function(picture) {
    var pic = picture.replace("200x200", "270x270");
    return pic;
  });

  Handlebars.registerHelper('stepNumber', function(index) {
    var i = index + 1;
    return i;
  });
});
