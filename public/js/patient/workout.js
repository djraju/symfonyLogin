function setExercises(windex, sindex, index) {
  $('#current_exercise_display').text(exercises[windex][sindex]["'"+index+"'"].name);
  $('#provider').text(exercises[windex][sindex]["'"+index+"'"].provider);

  if (exercises[windex][sindex]["'"+index+"'"].notes === '' || exercises[windex][sindex]["'"+index+"'"].notes === null ) {
    $('#current_note_box').hide();
  } else {
    $('#current_note_box').show();
    $('#current_note_display').text(exercises[windex][sindex]["'"+index+"'"].notes);
  }
  var textareaName = exercises[windex][sindex]["'"+index+"'"].provider+", Session "+sindex+", "+exercises[windex][sindex]["'"+index+"'"].name;
  $('.comment-block').find('.comment-box').find('textarea').attr('name', textareaName);

  // need to detach all existing carousel data
  $('#exerciseSteps').carousel("pause").removeData();
  $('ul.carousel-indicators li').remove();
  $('div.carousel-inner').children().remove();

  for (var i = 1; i <= 3; i++) {
    if (exercises[windex][sindex]["'"+index+"'"].steps[i] !== undefined) {
      $('#step' + i + 'Wrapper').show();

      // create carousel item
      $('ul.carousel-indicators').append('<li id="indicator' + i + '" data-target="#exerciseSteps" data-slide-to="' + (i - 1) + '" class="carousel_square"></li>');
      $('div.carousel-inner').append('<div id="slide' + i + '" class="carousel-item"><img class="img' + i + '"></div>');

      $('.img' + i).attr("src", exercises[windex][sindex]["'"+index+"'"].stepsPicture[i].replace("200x200", "760x760"));
      $('#step' + i).attr("src", exercises[windex][sindex]["'"+index+"'"].stepsPicture[i]);
      $('#step' + i + 'Description').text(exercises[windex][sindex]["'"+index+"'"].steps[i]);
    } else {
      $('#step' + i + 'Wrapper').hide();

      // remove carousel item
      $('#indicator' + i).remove();
      $('#slide' + i).remove();
    }
  }

  // set the active carousel slide
  $('#indicator1').addClass('active');
  $('#slide1').addClass('active');
  $('#exerciseSteps').carousel(0);

  $('.workout_side_titles').removeClass('active');
  
  $('#wo-'+ windex +'-se-'+ sindex + '-ex-' + (index.toString()).replace(/'/g,'')).addClass('active');

  $('a[href=#'+windex+']').parent().trigger('click');
  $('a[href=#'+windex+']').parent().addClass('active');
  $('a[href=#'+windex+']').parent().siblings().removeClass('active');
  $('div#'+windex).addClass('active');
  $('div#'+windex).siblings().removeClass('active');

  workoutIndex = windex;
  sessionIndex = sindex;
  exerciseIndex = index;
}

function hideShowVideoPlayer(videoId) {
  // if there's no video, just show the image carousel
  if ((videoId === null) || (videoId === "")) {
    $('#player').hide();
    $('.slides').show();
    $('#exercise-upgrade-btn').hide();
    $('#exerciseSteps').carousel();
  } else {
    // if free user, so no player is defined
    if ($('#player').length === 0) {
      // show the carousel and upgrade text
      $('.slides').show();
      $('#exercise-upgrade-btn').show();
      $('#exerciseSteps').carousel();
    } else {
      // premium user, show the video
      $('#player').show();
      $('.slides').hide();
    }
  }
}

function progressBar() {

  var progress = Math.floor((numCompleted / totalExercises) * 100),
          progressBar = $('#progress_bar');

  progressBar.width(progress + '%');

  return progress;
}

function markExerciseAsDone() {

  var checkboxElement = $('#wo-'+ workoutIndex +'-se-' + sessionIndex + '-ex-' + exerciseIndex + ' span[class=status]');

  var isUnchecked = checkboxElement.children().hasClass('fa-square-o');

  if (isUnchecked) {

    checkboxElement.click();
  }
}

function moveToNextExercise() {
  
  removeInactiveStatus('.icon-backward');
  currActiveEx = $('.workout_side_titles.active').attr('id');
  currWoindex  = currActiveEx.split('-')[1];
  currSeindex  = currActiveEx.split('-')[3];
  currExindex  = currActiveEx.split('-')[5];

  var workoutTabVal = $('#workoutTab').val();
  var incompletedExercises = $("#"+workoutTabVal+" span[class=status]").find("span.fa-square-o").length;
  
  var exercisesArray = Object.keys(exercises[currWoindex][currSeindex]);
 
  var nextEx = exercisesArray[($.inArray("'"+currExindex+"'",exercisesArray) + 1) % exercisesArray.length].replace(/'/g,'');

  setExercises(currWoindex, currSeindex, nextEx);
  loadVideo(exercises[currWoindex][currSeindex]["'"+nextEx+"'"].video);

  var nextExIndex = $.inArray("'"+nextEx+"'",exercisesArray);
  if(nextExIndex >= 0  && nextExIndex == (exercisesArray.length-1)){
    setNextButtonAsInactive();
  }

  return false;
}

function setPreviousButtonAsInactive() {
  $('.icon-backward').addClass('inactive');
  $('.icon-backward').css('pointer-events', 'none');
  $('.icon-backward').children().addClass('inactive');
}

function setNextButtonAsInactive() {
  $('.icon-forward').addClass('inactive');
  $('.icon-forward').css('pointer-events', 'none');
  $('.icon-forward').children().addClass('inactive');
}

function removeInactiveStatus(element) {
  $(element).removeClass('inactive');
  $(element).css('pointer-events', '');
  $(element).children().removeClass('inactive');
}

function onAjaxFinished(response) {
  numCompleted = response.numCompleted;
  var percentage = progressBar();

  if (percentage === 100)   {
    var objSelectedWorkoutDate = new Date( selectedWorkoutDate );
    var flashMessageDate = dayName[objSelectedWorkoutDate.getDay()]+", "+months[objSelectedWorkoutDate.getMonth()]+" "+objSelectedWorkoutDate.getDate();
    addFlashMessage("And you're done for "+flashMessageDate+". Great work!");
  }
}

$(function() {
  setPreviousButtonAsInactive();
  $('html, body').css('overflow', 'hidden');
  if( currentDate != selectedWorkoutDate ) {
      $('.comment').hide();
  }
  else {
    $('.comment').show();
  }
  if( programStatus != 1 ) {
      $('.workout_side_titles .status').css({'pointer-events':'none'});
      $('.comment').css('pointer-events', 'none');
      $('.comment-box').css('pointer-events', 'none');
      $('.paper-workout').css('pointer-events', 'none');
      $('#workout_box').css('pointer-events', 'none');
      $('#exercise_date').css('pointer-events', 'none');
      $('.mark_session_exercise').css('pointer-events', 'none');
      $('.mark_workout_exercise').css('pointer-events', 'none');
  }
  if (!($.isEmptyObject(exercises))) {

    var uncheckedexercise = "";//$(".fa-square-o").first().parent().parent().attr('id'); //find first unchecked exercise
    $(document).find('.exercise-li').each( function() {
        uncheckedexercise = $(this).find('.fa-square-o').first().parent().parent().attr('id');
        if( uncheckedexercise && $.type( uncheckedexercise ) === 'string' ) {
            return false;
        }
    }); 
    if (uncheckedexercise)
    {
      workoutIndex = uncheckedexercise.split('-')[1];
      sessionIndex = uncheckedexercise.split('-')[3];
      exerciseIndex = uncheckedexercise.split('-')[5];
    }
    setExercises(workoutIndex,sessionIndex, exerciseIndex);

    hideShowVideoPlayer(exercises[workoutIndex][sessionIndex]["'"+exerciseIndex+"'"].video);

    currActiveEx = $('.workout_side_titles.active').attr('id');
    currWoindex = currActiveEx.split('-')[1];
    currSeindex = currActiveEx.split('-')[3];
    currExindex = currActiveEx.split('-')[5];

    var exercisesArray = Object.keys(exercises[currWoindex][currSeindex]);
    var currExIndex = $.inArray("'"+currExindex+"'",exercisesArray);

    if(currExIndex >= 0  && currExIndex == (exercisesArray.length-1)){
      setNextButtonAsInactive();
    }
    if(currExIndex>0){
      var prevEx = exercisesArray[ ($.inArray("'"+currExindex+"'",exercisesArray)-1)].replace(/'/g,'');
      var prevExIndex = $.inArray("'"+prevEx+"'",exercisesArray);
      if(prevExIndex >= 0){
        removeInactiveStatus('.icon-backward');//enable previous button as there are exercises before current exercise in current session
      }
    }

  }

  $('.exercise_done').click(function(e) {
    e.preventDefault();

    markExerciseAsDone();
    moveToNextExercise();
  });

  $('.icon-backward').click(function(e) {
    e.preventDefault();

    removeInactiveStatus('.icon-forward');
    currActiveEx = $('.workout_side_titles.active').attr('id');
    currWoindex = currActiveEx.split('-')[1];
    currSeindex = currActiveEx.split('-')[3];
    currExindex = currActiveEx.split('-')[5];
    
    var exercisesArray = Object.keys(exercises[currWoindex][currSeindex]);
      var prevEx = "";
      if( exercisesArray[($.inArray("'"+currExindex+"'",exercisesArray)-1)] ) {
          prevEx = ( exercisesArray[($.inArray("'"+currExindex+"'",exercisesArray)-1)].toString() ).replace(/'/g,'');
      }

    setExercises(currWoindex, currSeindex, prevEx);
    loadVideo(exercises[currWoindex][currSeindex]["'"+prevEx+"'"].video);

    var prevExIndex = $.inArray("'"+prevEx+"'",exercisesArray);
    if(prevExIndex === 0){
      setPreviousButtonAsInactive();
    }
  }); 

  $('.icon-forward').click(function(e) {
    e.preventDefault();

    moveToNextExercise();
 });

  $('.workout_side_titles').click(function(e) {
      e.preventDefault();
      var wid = this.id.split('-')[1];
      var sid = this.id.split('-')[3];
      var id = this.id.split('-')[5];
      var boolAlreadySelected = 0;

      workoutIndex = wid;
      exerciseIndex = id;
      sessionIndex = sid;

      if($(this).hasClass('active')) {
          boolAlreadySelected = 1;
      }

      setExercises(workoutIndex, sessionIndex, id);

      if(boolAlreadySelected == 0) {
          loadVideo(exercises[wid][sid]["'"+id+"'"].video);
      }

      if (e.target.className.indexOf('fa') !== -1 && typeof player !== 'undefined' && boolAlreadySelected == 0) {
          player.stopVideo();
      }
      //enable/disable back/previous button if exercise is clicked directly
      var exercisesArray = Object.keys(exercises[wid][sid]);
      var currExIndex    = $.inArray("'"+id+"'",exercisesArray);

    if(currExIndex >= 0  && currExIndex == (exercisesArray.length-1)){
      setNextButtonAsInactive();
    }
    else{
      removeInactiveStatus('.icon-forward');
    }
    if(currExIndex>0){
      var prevEx = exercisesArray[ ($.inArray("'"+id+"'",exercisesArray)-1)].replace(/'/g,'');
      var prevExIndex = $.inArray("'"+prevEx+"'",exercisesArray);
      if(prevExIndex >= 0){
        removeInactiveStatus('.icon-backward');//enable previous button as there are exercises before current exercise in current session
      }
    }
    else{
        setPreviousButtonAsInactive();
      }
     
  });

  for (var wkey in exercises){
      for(var skey in exercises[wkey]){
          for(ekey in exercises[wkey][skey]){
              res = ekey.replace(/'/g,'');
              var e = $('#wo-'+wkey+'-se-' + skey + "-ex-" + res + ' span[class=status]');
              e.click(handleExerciseCheckboxClick(e, true, onAjaxFinished));
              totalExercises++;
          }
      }
  }

  progressBar();

    $('#exercise_tabs a').click(function(e) {
        var tabId = $(this).data('wid');
        var uncheckedexercise = "";
        $('.tab-content').find('div#'+tabId).find('.exercise-li').each( function() {
            uncheckedexercise    = $(this).find('.fa-square-o').first().parent().parent().attr('id');
            uncheckedExerciseObj = $(this).find('.fa-square-o').first().parent().parent();
            if( uncheckedexercise && $.type( uncheckedexercise ) === 'string' ) {
                return false;
            }
        });
        uncheckedExerciseObj.trigger('click');
        if (typeof player !== 'undefined') {
            player.stopVideo();
        }
    });
});
