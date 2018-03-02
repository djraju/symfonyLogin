function handleExerciseCheckboxClick(e, orderedList, callback) {
  return function() {
    var completed = Array();

    $('ul.exercise-list').find('li.active').removeClass('active'); //remove highlighter from exercise scrolled into view on page load;

    toggleExerciseCheckbox(e);

    $('.exercise-list .fa.fa-check-square-o').each(function() {
        if( !$(this).hasClass('mark_session_exercise') ) {
            var elementId = $(this).parent().parent().attr('id');

            var res = elementId.split("-");
            var wid = res[1];
            var sid = res[3];
            var id = res[5];

            var exerciseId;
            /*if (orderedList) {
             exerciseId = exercises[sid][id].id;
             } else {
             exerciseId = id;
             }*/
            exerciseId = id;
            if(exerciseId!=""){
                completed.push({patientProgramId: programId, workoutId:wid, sessionId:sid, exerciseId:exerciseId, workoutDate: selectedWorkoutDate});
            }
        }

    });
    
    updateMarkCompleteStatus(e);
    updateExercises(completed, callback);
  };
}

function updateExercises(completed, callback) {
  var data = {'completed': completed, 'patientProgramId': programId, workoutDate: selectedWorkoutDate};

  $.ajax({
    url: updateExercisesURI,
    data: data,
    type: 'GET'
  }).done(function(response) {
        // get the new completed exercise count
        var obj = $.parseJSON(response);

        if (callback !== undefined) {
          callback(obj);
        }
  });
}

function getCurrentExercises(url, date) {
    if( date === undefined || date.length == 0  ) {
        date = "";
    }
  $.ajax({
    url: url,
    type: 'GET',
      data: { date: date},
  }).done(function(response) {
      var obj = $.parseJSON(response);
      if(obj.status == false) {
          $('#exercise_tabs').find('.fa-check-square-o').each( function(){
              $(this).addClass('fa-square-o');
              $(this).removeClass('fa-check-square-o');
          });
          $('#exercise_tabs').hide();
          var sourceHTML = $("#blank-exercise-template").html();
          $('.tab-content').html(sourceHTML);
          $('#loading').hide();
      } else {
          programId  = obj.programId;
          providerId = obj.provider;
          // populate the exercises
          var source = $("#workoutTab-template").html();
          var template = Handlebars.compile(source);
          var html = template(obj);
          $('#exercise_tabs').html(html);
          $('#exercise_tabs').show();
          var source = $("#exercise-template").html();
          var template = Handlebars.compile(source);
          var html = template(obj);

          $('.tab-content').html(html);

          var selectedDate = obj.selectedDate;

          $.each(obj.workouts, function(index, value) {
              if( index == 0 ) {
                  $('#exercise_tabs li:eq('+index+')').addClass('active');
                  $('.tab-content div:eq('+index+')').addClass('active');
              }
              var printPath = printURI.replace('path', value.id);

              $('#paper-workout'+value.id).attr('href', printPath);
              var Workout_Exercises           = Array();
              var Workout_Completed_Exercises = Array();

              if(!$.isArray(value.sessions)){

                  $.each(value.sessions, function( sess_no, sessions ) {
                      var session_Exercises           = Array();
                      var session_Completed_Exercises = Array();
                      $.each( sessions, function( key, session ) {
                          exToday = value.id + '-' + session.session_no + '-' + session.exerciseId;

                          Workout_Exercises.push({patientProgramId: programId, workoutId:value.id, sessionId:session.session_no, exerciseId:session.exerciseId});
                          session_Exercises.push({patientProgramId: programId, workoutId:value.id, sessionId:session.session_no, exerciseId:session.exerciseId});
                          liID = 'wo-' + value.id + '-se-' + session.session_no + '-ex-' + session.exerciseId;
                          node = $('li#'+liID);
                          if( $.inArray( exToday, obj.exercisesToday ) !== -1 ) {
                              node.find('.status').children('span').removeClass('fa-square-o');
                              node.find('.status').children('span').addClass('fa-check-square-o');

                              Workout_Completed_Exercises.push({patientProgramId: programId, workoutId:value.id, sessionId:session.session_no, exerciseId:session.exerciseId});
                              session_Completed_Exercises.push({patientProgramId: programId, workoutId:value.id, sessionId:session.session_no, exerciseId:session.exerciseId});
                          }
                      });
                      if( session_Exercises.length == session_Completed_Exercises.length ) {
                          $('#mark_session_exercise_'+value.id+'_'+sess_no).removeClass('fa-square-o');
                          $('#mark_session_exercise_'+value.id+'_'+sess_no).addClass('fa-check-square-o');
                      }
                  });

                  if( Workout_Exercises.length == Workout_Completed_Exercises.length ) {
                      $('#mark_workout_exercise_'+value.id).removeClass('fa-square-o');
                      $('#mark_workout_exercise_'+value.id).addClass('fa-check-square-o');
                  }
              }
          });
          $('ul.exercise-list li').each(function() {
              $(this).find('.comment').click( function(e) {
                  e.stopPropagation();
              });
              $(this).find('.comment-box').click( function(e) {
                  e.stopPropagation();
              });
              $(this).click(handleExerciseCheckboxClick($(this).find('.status'), true, onAjaxFinished));
          });

          $('.comment').on('click', function() {
              $(this).siblings('div.comment-box').toggle();
              $(this).parent('li').siblings('li').find('div.comment-box').each( function() {
                  if( $(this).is(':visible') ) {
                      $(this).toggle();
                  }
              });
          });

          $('.comment-button').on('click', function() {
              var comment     = $(this).siblings('textarea').attr('name')+" :<br/>"+$(this).siblings('textarea').val();
              var _this       = $(this);
              var data        = {id: providerId, sendMessageInput: comment};
              $.ajax({
                  url: postMessageURI,
                  data: data,
                  type: 'POST',
                  success: function( response ) {
                      _this.parent().toggle();
                  },
                  error: function( xhr, status, error ) {
                      _this.siblings('span').text( error );
                  }
              });
          });

          selectedWorkoutDate = selectedDate;
          $('.exercise-list li').each(function() {
              if( currentDate != selectedWorkoutDate ) {
                  $(this).find('.comment').hide();
              }
          });
          $('#loading').hide();
          $(document).find('ul.exercise-list').find('.session-blocks:not(:first)').each( function() {
              if($(this).index() != 0) {
                  $(this).find('li').slideToggle(500);
                  $(this).find('.fa-chevron-down').addClass('fa-chevron-right');
                  $(this).find('.fa-chevron-right').removeClass('fa-chevron-down');
              }
          });

          $(document).find('.session-header').on('click', function(e) {
              if( e.target.className.indexOf('mark_session_exercise') === -1 ) {
                  var isExpanded  = false;
                  var blockNumber = $(this).parent().index();
                  if ($(this).find('.fa-chevron-right').length > 0) {
                      isExpanded = true;
                  }

                  if (isExpanded) {
                      $(this).siblings('li').slideDown(500);
                      $(this).find('.fa-chevron-right').addClass('fa-chevron-down');
                      $(this).find('.fa-chevron-down').removeClass('fa-chevron-right');
                  }
                  else {
                      $(this).siblings('li').slideUp(500);
                      $(this).find('.fa-chevron-down').addClass('fa-chevron-right');
                      $(this).find('.fa-chevron-right').removeClass('fa-chevron-down');
                  }
              }
          });
      }
  });
}

function getRemainingExercises() {
    var remainingExercises = Array();
    $('.exercise-list .fa.fa-check-square-o').each(function() {
        if (!$(this).hasClass('mark_session_exercise')) {
            var elementId = $(this).parent().parent().attr('id');

            var res = elementId.split("-");
            var wid = res[1];
            var sid = res[3];
            var id  = res[5];

            if( id != "" ) {
                remainingExercises.push({patientProgramId: programId, workoutId:wid, sessionId:sid, exerciseId:id});
            }
        }
    });

    return remainingExercises;
}

function markAllCheckboxes(wid, updateCharts){
    updateCharts = typeof updateCharts == 'undefined' ? 1 : updateCharts;
  $("#"+wid+" .exercise-list span[class=status] span").each( function() {
      if($(this).hasClass('fa-square-o')){
        $(this).removeClass('fa-square-o');
        $(this).addClass('fa-check-square-o');
      }
  });
  $("#"+wid+" .mark_session_exercise").each( function() {
      if($(this).hasClass('fa-square-o')){
        $(this).removeClass('fa-square-o');
        $(this).addClass('fa-check-square-o');
      }
  });
  if(updateCharts == 0 ){
    updateExercises(getRemainingExercises());
  } else {
    updateExercises(getRemainingExercises(), onAjaxFinished);
  }
}

function unMarkAllCheckboxes(wid, updateCharts){
    updateCharts = typeof updateCharts == 'undefined' ? 1 : updateCharts;
  $("#"+wid+" .exercise-list span[class=status] span").each( function() {
      if($(this).hasClass('fa-check-square-o')){
        $(this).removeClass('fa-check-square-o');
        $(this).addClass('fa-square-o');
      }
  });
  $("#"+wid+" .mark_session_exercise").each( function() {
      if($(this).hasClass('fa-check-square-o')){
        $(this).removeClass('fa-check-square-o');
        $(this).addClass('fa-square-o');
      }
  });
  if(updateCharts == 0 ){
    updateExercises(getRemainingExercises());
  } else {
    updateExercises(getRemainingExercises(), onAjaxFinished);
  }
}

function processExercisesChecksOnLoad(){

  $(".mark_workout_exercise").each( function() {
    updateSessionAndWorkoutMarkedStatus($(this).data("wid"));
  });
}

function updateMarkCompleteStatus(node){
  var elementId = node.parent().attr('id');
  var res = elementId.split("-");
  var wid = res[1];
  var sid = res[3];
  var id = res[5];
  var iconSpan = node.find('.fa.fa-square-o');
  if (iconSpan.length === 0) {
    //Exercise is Marked as complete
    updateSessionAndWorkoutMarkedStatus(wid);
  }
  else {
    // Exercise is Not Complete
    if($("#mark_workout_exercise_"+wid).hasClass("fa-check-square-o")){
      $("#mark_workout_exercise_"+wid).removeClass("fa-check-square-o");
      $("#mark_workout_exercise_"+wid).addClass("fa-square-o");
    }
    if($("#mark_session_exercise_"+wid+"_"+sid).hasClass("fa-check-square-o")){
      $("#mark_session_exercise_"+wid+"_"+sid).removeClass("fa-check-square-o");
      $("#mark_session_exercise_"+wid+"_"+sid).addClass("fa-square-o");
    }
  }
}

function updateSessionAndWorkoutMarkedStatus(wid){
  var _this = $("#mark_workout_exercise_"+wid);
    var totalSessionsCount     = 0;
    var completedSessionsCount = 0;
    $("#"+wid+" .mark_session_exercise").each(function(){
      totalSessionsCount++;
      var totalSessionExCount     = 0;
      var completedSessionExCount = 0;
      $(this).closest("div.session-blocks").find("li span[class=status] span").each( function() {
        totalSessionExCount++;
        if( $(this).hasClass('fa-check-square-o') ) {
          completedSessionExCount++;
        }
      });
      if( totalSessionExCount == completedSessionExCount ) {
        $(this).removeClass('fa-square-o');
        $(this).addClass('fa-check-square-o');
        completedSessionsCount++;
      }
    });
    if( totalSessionsCount == completedSessionsCount ) {
      $(_this).removeClass('fa-square-o');
      $(_this).addClass('fa-check-square-o');
    }
}
$(function () {

Handlebars.registerHelper('ifCond', function(totalWorkouts, v2, options) {
    if(totalWorkouts === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
});

