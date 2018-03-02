function initialize() {
  $('#exercise_container div.pull-left').each(function() {
    var status = $(this).find('.status');
    status.click(handleExerciseClick(status));
  });

  $('#current_exercises div.pull-left').each(function() {
    var status = $(this).find('.status');
    status.click(handleExerciseClick(status));
  });

  $('.exerciseModal').each(function() {
        var parentElement = $(this);

        if( $(this).parent().parent().attr('id') != 'sessions_programs' ) {
            $(this).parent().find('a.subheader').click(function(e) {
                if(e.shiftKey){
                    if( $(this).closest('div').hasClass('exerciseItemShadow') ) return;
                    var currSelected = $(this).closest('div').attr('id');
                    var currSelectedIndex = $(this).closest('div').index();
                    var markExSelected = 0;
                    if($("#exercise_container div.exercise-item.exerciseItemShadow").length >= 1){

                        var lastSelectedEx = $("#exercise_container div.exercise-item.exerciseItemShadow").last().attr('id');
                        var lastSelectedExIndex = $("#exercise_container div.exercise-item.exerciseItemShadow").last().index();

                        if(currSelectedIndex<lastSelectedExIndex){
                            var minSelectedIndex = $("#exercise_container div.exercise-item.exerciseItemShadow").first().index();
                            var minSelectedId = $("#exercise_container div.exercise-item.exerciseItemShadow").first().attr('id');
                            $("#exercise_container div.exercise-item").each(function(){
                                if(markExSelected == 1){
                                    if(!($(this).css('display') == 'none')) {
                                        $(this).addClass('activePreview exerciseItemShadow');
                                    }
                                    if(minSelectedId == $(this).attr('id')){
                                        markExSelected = 0;
                                        $("#exercise_container div.exercise-item.exerciseItemShadow").each( function() {
                                            if( $(this).index() > minSelectedIndex ) {
                                                $(this).removeClass('exerciseItemShadow');
                                            }
                                        });
                                        return;
                                    }
                                }
                                else if(($(this).attr('id') == currSelected) && (markExSelected == 0)){
                                    markExSelected = 1;
                                    if(!($(this).css('display') == 'none')) {
                                        $(this).addClass('activePreview exerciseItemShadow');
                                    }
                                }
                            });
                        }
                        else{
                            $("#exercise_container div.exercise-item").each(function(){
                                if(markExSelected == 1){
                                    if(!($(this).css('display') == 'none')) {
                                        $(this).addClass('activePreview exerciseItemShadow');
                                    }
                                    if(currSelected == $(this).attr('id')){
                                        markExSelected = 0;
                                        return;
                                    }
                                }
                                else if(($(this).attr('id') == lastSelectedEx) && (markExSelected == 0)){
                                    markExSelected = 1;
                                }
                                else{
                                    $(this).removeClass('exerciseItemShadow');
                                }
                            });
                        }
                    }
                    else{
                        $(this).parent().parent().addClass("activePreview exerciseItemShadow");
                    }

                }
                else if(e.ctrlKey){
                    if($(this).parent().parent().hasClass("exerciseItemShadow")) {
                        $(this).parent().parent().removeClass("exerciseItemShadow");
                    } else {
                        $(this).parent().parent().addClass("activePreview exerciseItemShadow");
                    }
                }
                else{
                    $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
                        $(this).removeClass('exerciseItemShadow');
                    });
                    $(this).parent().parent().addClass("activePreview exerciseItemShadow");
                }

                parentElement.modal();
                var ids = ( parentElement.parent().attr('id') ).split('library');
                if( ids.length > 0 ) {
                    parentElement.find(".modal-body").html("");
                    var exercise = {exercise: availableExercises[ids[1]] };
                    var source   = $("#modal-template").html();
                    var template = Handlebars.compile(source);
                    var html     = template(exercise);

                    parentElement.find(".modal-body").append(html);

                    var stepCount = $('#exerciseSteps' + ids[1]).find('.exerciseModalSlider').find('.overview').find('li').length;
                    if( stepCount > 1 ) {
                        $('#exerciseSteps' + ids[1]).find('.exerciseModalSlider').tinycarousel({ interval: true, bullets: true });
                    }
                }
            });
        } else {
            $(this).parent().find('a.subheader').click(function(e) {
                parentElement.modal();
                var ids = ( parentElement.parent().attr('id') ).split('exercises');
                if( ids.length > 0 ) {
                    if( parentElement.find(".modal-body").html() == "" ) {
                        var exercise = {exercise: availableExercises[ids[1]] };
                        var source   = $("#modal-template").html();
                        var template = Handlebars.compile(source);
                        var html     = template(exercise);

                        parentElement.find(".modal-body").append(html);
                    }
                    var stepCount = $(document).find('.ui-droppable').find('#exerciseSteps' + ids[1]).find('.exerciseModalSlider').find('.overview').find('li').length;
                    if( stepCount > 1 ) {
                        $(document).find('.ui-droppable').find('#exerciseSteps' + ids[1]).find('.exerciseModalSlider').tinycarousel({ interval: true, bullets: true });
                    }
                }
            });
        }
  });

  $('#clear-changes-btn').click(function() {
    // for each exercise that's checked, revert it by programatically clicking it
    $('#exercise_container span.fa-check-square-o').each(function() {
      $(this).parent().click();
    });

  });
}

function filterChoice(collection, haystack) {
  var include = false;

  for (var i in collection) {
    var select = collection[i];

    if ((select === '') || (select in haystack)) {
      include = true;
      break;
    }
  }

  return include;
}

function showAvailableExercises() {
    $('#exercise_container div.pull-left').hide();
    var injuryCounter = 0;
    var injuries = Array();
    $('#exerciseLibrary_injury').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        injuries.push(val);
        injuryCounter++;
    });
    if( injuryCounter == 0 ) {
        $('#exerciseLibrary_injury').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            injuries.push(val);
        });
    } else {
        injuryCounter = 0;
    }

    $('#editWorkout_injury').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        injuries.push(val);
        injuryCounter++;
    });
    if( injuryCounter == 0 ) {
        $('#editWorkout_injury').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            injuries.push(val);
        });
    } else {
        injuryCounter = 0;
    }

    $('#editWorkoutTemplate_injury').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        injuries.push(val);
        injuryCounter++;
    });
    if( injuryCounter == 0 ) {
        $('#editWorkoutTemplate_injury').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            injuries.push(val);
        });
    } else {
        injuryCounter = 0;
    }
      var positionCounter = 0;
      var positions = Array();
      $('#exerciseLibrary_position').siblings('div').find('li.active').each( function() {
            var val = $(this).find('input').val();
            positions.push(val);
          positionCounter++;
      });

    if( positionCounter == 0 ) {
        $('#exerciseLibrary_position').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            positions.push(val);
        });
    } else {
        positionCounter = 0;
    }
        $('#editWorkout_position').siblings('div').find('li.active').each( function() {
            var val = $(this).find('input').val();
            positions.push(val);
            positionCounter++;
        });
    if( positionCounter == 0 ) {
        $('#editWorkout_position').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            positions.push(val);
        });
    } else {
        positionCounter = 0;
    }
        $('#editWorkoutTemplate_position').siblings('div').find('li.active').each( function() {
            var val = $(this).find('input').val();
            positions.push(val);
            positionCounter++;
        });
    if( positionCounter == 0 ) {
        $('#editWorkoutTemplate_position').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            positions.push(val);
        });
    } else {
        positionCounter = 0;
    }

  var sessionNo = $('#editWorkout_sessionTab').val();
  var sessionExercises = Array();
  $("#"+sessionNo).find("#sessions_programs >div").each(function(){
    exerciseStr = $(this).attr('id');
    var numberRegex = /\d+/g;
    var matches = exerciseStr.match(numberRegex);
    sessionExercises.push(parseInt(matches[0]));
  }); 
    var libraryType = $('#library-type').val();
    if( libraryType != null ) {
        var practiceIds = libraryType;
    }
  for (var key in availableExercises) {
      var showSelector = false;
      if( typeof exercisePractices !== 'undefined' ) {
          var practiceId   = exercisePractices[availableExercises[key].exercise.id];
          if( typeof practiceIds !== 'undefined' ) { 
              if( $.inArray('system', practiceIds ) !== -1 && practiceId == "" ) {
                  showSelector = true;
              }

              if( practiceId != "" && $.inArray(practiceId, practiceIds ) !== -1 ) {
                  showSelector = true;
              }

          } else {
              showSelector = true;
          }
      } else {
          showSelector = true;
      }

      var includeInjury = filterChoice(injuries, availableExercises[key].injuries);
      var includePosition = filterChoice(positions, availableExercises[key].position);

    if (includeInjury && includePosition && showSelector) {
      var selector = $('#library' + availableExercises[key].exercise.id);
      var availbleExId = availableExercises[key].exercise.id;

      if(sessionExercises.indexOf(availbleExId) === -1 ){
        selector.show();
      }
      else{
        selector.hide();
      }
    }
  }

  $('input#search').unbind("keyup");

  if($('div#exercise_container div.exercise-item:visible').length > 0){
    $('input#search').quicksearch('div#exercise_container div.exercise-item:visible', {
      'onAfter': function() {

      }
    });
  }
}

function handleExerciseClick(node) {
      return function() {
            toggleExerciseCheckbox(node);

            // toggle the state of the underlying checkbox
            var input = $(this).find('input');
            input.prop('checked', !input.prop('checked'));
      };
}

$(function() {
    initialize();
    showAvailableExercises();

    $('#exercise_tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('.exerciseModal').on('hidden.bs.modal', function () {
        $('.activePreview').removeClass('activePreview');
    });

    $('#clear-search').click(function() {
        $('#search').val('');
        showAvailableExercises();
    });

    $('.exerciseModal').on('hidden.bs.modal', function () {
        $(this).find("iframe").removeAttr("src");
    });
});