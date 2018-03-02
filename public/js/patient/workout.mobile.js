var allWorkouts         = Array();
var completedWorkouts   = Array();
var programId  = "";

function getCurrentExercises(url, date) {
    if( date === undefined || date.length == 0  ) {
        date = "";
    }
  $.ajax({
    url: url,
    type: 'POST',
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
          obj['viewExerciseURI'] = viewExerciseURI;
          programId = obj.programId;

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

          $.each(obj.workouts, function (index, value) {
              if (index == 0) {
                  $('#exercise_tabs li:eq(' + index + ')').addClass('active');
                  $('.tab-content div:eq(' + index + ')').addClass('active');
              }

              var printPath = printURI.replace('path', value.id);

              $('#paper-workout' + value.id).attr('href', printPath);
              var Workout_Exercises = Array();
              var Workout_Completed_Exercises = Array();
              if (!$.isArray(value.sessions)) {
                  $.each(value.sessions, function (sess_no, sessions) {
                      var session_Exercises = Array();
                      var session_Completed_Exercises = Array();
                      $.each(sessions, function (key, session) {
                          exToday = value.id + '-' + session.session_no + '-' + session.exerciseId;
                          allWorkouts.push({
                              patientProgramId: programId,
                              workoutId: value.id,
                              sessionId: session.session_no,
                              exerciseId: session.exerciseId
                          });
                          Workout_Exercises.push({
                              patientProgramId: programId,
                              workoutId: value.id,
                              sessionId: session.session_no,
                              exerciseId: session.exerciseId
                          });
                          session_Exercises.push({
                              patientProgramId: programId,
                              workoutId: value.id,
                              sessionId: session.session_no,
                              exerciseId: session.exerciseId
                          });
                          liID = 'wo-' + value.id + '-se-' + session.session_no + '-ex-' + session.exerciseId;
                          node = $('li#' + liID);

                          if ($.inArray(exToday, obj.exercisesToday) !== -1) {
                              node.find('.status').children('span').removeClass('fa-square-o');
                              node.find('.status').children('span').addClass('fa-check-square-o');
                              completedWorkouts.push({
                                  patientProgramId: programId,
                                  workoutId: value.id,
                                  sessionId: session.session_no,
                                  exerciseId: session.exerciseId
                              });
                              Workout_Completed_Exercises.push({
                                  patientProgramId: programId,
                                  workoutId: value.id,
                                  sessionId: session.session_no,
                                  exerciseId: session.exerciseId
                              });
                              session_Completed_Exercises.push({
                                  patientProgramId: programId,
                                  workoutId: value.id,
                                  sessionId: session.session_no,
                                  exerciseId: session.exerciseId
                              });
                          }
                      });
                      if (session_Exercises.length == session_Completed_Exercises.length) {
                          $('#mark_session_exercise_' + value.id + '_' + sess_no).removeClass('fa-square-o');
                          $('#mark_session_exercise_' + value.id + '_' + sess_no).addClass('fa-check-square-o');
                      }
                  });

                  if (Workout_Exercises.length == Workout_Completed_Exercises.length) {
                      $('#mark_workout_exercise_' + value.id).removeClass('fa-square-o');
                      $('#mark_workout_exercise_' + value.id).addClass('fa-check-square-o');
                  }
              }
          });

          var uncheckedexercise
              = $(".fa-square-o").first().parent().parent().attr('id'); //find first unchecked exercise


          if (uncheckedexercise) {
              $('html, body').animate({
                  scrollTop: $(".fa-square-o").first().parent().parent().offset().top - 120 //keep it 120 pixel below top so that header doesn't hide it and also user is able to previous exercise if applicable
              }, 100);

              $(".fa-square-o").first().parent().parent().parent().addClass('active'); //add class to highlight

          }
          selectedWorkoutDate = selectedDate;
          $('.exercise-list li').each(function () {
              if (currentDate != selectedWorkoutDate) {
                  $(this).find('.comment').hide();
              }
          });

          $(document).find('.workout_side_titles').each(function () {
              $(this).on('click', function () {
                  $(this).find('.status').css('background', '#fff');
              });
              $(this).on('mouseover', function () {
                  $(this).find('.status').css('background', '#fff');
              });
              $(this).on('mouseout', function () {
                  $(this).find('.status').css('background', '#f1f1f2');
              });
          });

          $('.clickable').each(function () {
              $(this).click(handleExerciseCheckboxClick($(this).find('.status')));
          });

          if (programStatus != 1) {
              $('.workout_side_titles').css({'pointer-events': 'none'});
              $('.exercise-list .status').css({'pointer-events': 'none'});
              $('.mark_workout_exercise').css({'pointer-events': 'none'});
              $('.mark_session_exercise').css({'pointer-events': 'none'});
              $('.comment').css('pointer-events', 'none');
              $('.comment-box').css('pointer-events', 'none');
              $('.paper-workout').css('pointer-events', 'none');
              $('#exercise_date').css('pointer-events', 'none');
          }

          var sessionBlock = "";
          $(document).find('ul.exercise-list').find('.session-blocks').find('li').each(function () {
              sessionBlock = $(this).find('.fa-square-o').first().parent().parent().parent().parent().attr('id');
              if (sessionBlock && $.type(sessionBlock) === 'string') {
                  return false;
              }
          });

          if (sessionBlock !== "") {
              $(document).find('ul.exercise-list').find('.session-blocks:not(#' + sessionBlock + ')').each(function () {
                  if($(this).index() != 0) {
                      $(this).find('li').slideToggle(500);
                      $(this).find('.fa-chevron-down').addClass('fa-chevron-right');
                      $(this).find('.fa-chevron-right').removeClass('fa-chevron-down');
                  }
              });
          } else {
              $(document).find('ul.exercise-list').find('.session-blocks:not(:first)').each(function () {
                  $(this).find('li').slideToggle(500);
                  $(this).find('.fa-chevron-down').addClass('fa-chevron-right');
                  $(this).find('.fa-chevron-right').removeClass('fa-chevron-down');
              });
          }

          $('.session-header').on('click', function (e) {
              if (e.target.className.indexOf('mark_session_exercise') === -1) {
                  var isExpanded = false;
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

$(document).on('click', ".mark_workout_exercise" ,function(e) {

    if( $(this).hasClass('fa-square-o') ) {
        $(this).removeClass('fa-square-o');
        $(this).addClass('fa-check-square-o');
        markAllCheckboxes($(this).data('wid'), updateCharts=0);
    } else if( $(this).hasClass('fa-check-square-o') ) {
        $(this).addClass('fa-square-o');
        $(this).removeClass('fa-check-square-o');
        unMarkAllCheckboxes($(this).data('wid'), updateCharts=0);
    }
});

$(document).on('click', '.mark_session_exercise', function() {

    if( $(this).hasClass('fa-square-o') ) {
        $(this).removeClass('fa-square-o');
        $(this).addClass('fa-check-square-o');

        /* Below logic is to mark all exercises in a session as complete - Mark All Session Exercises */
        $(this).closest("div.session-blocks").find("li span[class=status] span").each( function() {
            if( $(this).hasClass('fa-square-o') ) {
                $(this).removeClass('fa-square-o');
                $(this).addClass('fa-check-square-o');
            }
        });
        /* End of Mark All Session Exercises*/

        /* Below logic is to check whether all exercises in a workout are complete, if yes then mark workout as "Mark All Exercises" */
        var totalCount     = 0;
        var completedCount = 0;
        $("#"+$(this).data('wid')+" .exercise-list span[class=status] span").each( function() {
            totalCount++;
            if( $(this).hasClass('fa-check-square-o') ) {
                completedCount++;
            }
        });
        if( totalCount == completedCount ) {
            $('#mark_workout_exercise_'+ $(this).data('wid')).removeClass('fa-square-o');
            $('#mark_workout_exercise_'+ $(this).data('wid')).addClass('fa-check-square-o');
        }
        /* End of "Mark All Exercises" */
    } else if( $(this).hasClass('fa-check-square-o') ) {
        $(this).removeClass('fa-check-square-o');
        $(this).addClass('fa-square-o');

        /* Below logic is to un-mark all exercises in a session as complete - UNMark All Session Exercises */
        $(this).closest("div.session-blocks").find("li span[class=status] span").each( function() {
            if( $(this).hasClass('fa-check-square-o') ) {
                $(this).removeClass('fa-check-square-o');
                $(this).addClass('fa-square-o');
            }
        });
        /* End of UNMark All Session Exercises*/

        /* Since we have un-checked a session, make sure "Mark All Exercises" associated for a workout is also un-checked */
        if($('#mark_workout_exercise_'+ $(this).data('wid')).hasClass('fa-check-square-o')) {
            $('#mark_workout_exercise_'+ $(this).data('wid')).removeClass('fa-check-square-o');
            $('#mark_workout_exercise_'+ $(this).data('wid')).addClass('fa-square-o');
        }
    }
    updateExercises(getRemainingExercises());
});

$(document).on('click', '.comment', function() {
    $(this).siblings('div.comment-box').toggle();
    $(this).parent('li').siblings('li').find('div.comment-box').each( function() {
        if( $(this).is(':visible') ) {
            $(this).toggle();
        }
    });
});

$(document).on('click', '.comment-button', function() {
    var comment     = $(this).siblings('textarea').attr('name')+" :<br/>"+$(this).siblings('textarea').val();
    var _this       = $(this);
    var data        = {id: providerId, sendMessageInput: comment};
    $.ajax({
        url: postMessageURI,
        data: data,
        type: 'POST',
        success: function( response ) {
            _this.siblings('textarea').val('');
            _this.parent().toggle();
        },
        error: function( xhr, status, error ) {
            _this.siblings('span').text( error );
        }
    });
});

$(function() {
    var objStartDate = new Date( selectedWorkoutDate );
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var currentSelectedDate = {};
    currentSelectedDate[new Date( selectedWorkoutDate )] = new Date( selectedWorkoutDate );
    $("#exercise_date").val( dayName[objStartDate.getDay()]+", "+months[objStartDate.getMonth()]+" "+objStartDate.getDate() );
        $("#exercise_date").datepicker({
        enableOnReadonly: true,
        minDate: new Date( programStartDate ),
        maxDate: new Date( currentClientDate ),
        autoclose: true,
        dateFormat: 'D, M dd',
        hideIfNoPrevNext: true,
            beforeShowDay: function(date)
            {
                var highlight = currentSelectedDate[date];
                if (highlight) {
                    return [true, "event", ""];
                }
                else {
                    return [true, '', ''];
                }
            },
        onSelect: function(selectedDate){
            selectedWorkoutDate = selectedDate;
            var displayDateObj = new Date( selectedDate );
            //$("#exercise_date").val(dayName[displayDateObj.getDay()]+", "+months[displayDateObj.getMonth()]+" "+displayDateObj.getDate());
            var dateTypeVar = $('#exercise_date').datepicker('getDate');
            getCurrentExercises( getCurrentExercisesURI, $.datepicker.formatDate('mm/dd/yy',dateTypeVar) );
        },
    });
    getCurrentExercises(getCurrentExercisesURI, selectedWorkoutDate);
    $('#workout_tab').addClass('active');
    $('#exercise_tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
});
