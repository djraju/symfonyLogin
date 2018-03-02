function processDateJoinedUntilNow(callback) {
  var data = Array();

  var y = dateJoined.getFullYear();
  var m = dateJoined.getMonth();
  var d = dateJoined.getDate();

  // truncate the time so the date lines up with the graph tick marks
  var workingDate = new Date(y, m, d);
  var today = new Date();

  // iterates from the earliest day to the latest day and tries to get a workout based on the key.
  // if found, calculate the percentage, otherwise mark it a zero.
  while (workingDate.getTime() <= today.getTime()) {
    var a = callback(workingDate);

    data.push(a);

    workingDate = new Date(workingDate);
    workingDate.setDate(workingDate.getDate() + 1);
  }

  return data;
}

function createOverallProgressGraphData(workingDate) {
  var key = createKey(workingDate);
  var scoreObj = scores[key];

  
  var percentage = calculatePercentage(key);
  var intPercentage = Math.round(percentage * 100);
  var pTooltip = createTooltip(workingDate, 'Adherence', intPercentage);


  var a = [workingDate, percentage, pTooltip];
  if (scoreObj !== undefined) {
    for(var i=0;i<totalWorkouts.length;i++){
      var scoreObjKeys = Object.keys(scoreObj);
      var workoutId = totalWorkouts[i]['id'];
      if($.inArray(workoutId.toString(),scoreObjKeys) > -1){
        var scoreStr = "score"+totalWorkouts[i].id;
        var sTooltipStr = "sTooltip"+totalWorkouts[i].id;
        scoreStr = scoreObj[totalWorkouts[i]['id']].score / 100;
//console.log(scoreObj[totalWorkouts[i]['id']].status);
        if(totalWorkouts.length <= 1){
          sTooltipStr = createTooltip(workingDate, "Progress", Math.round(scoreStr * 100));
        }
        else{
          sTooltipStr = createTooltip(workingDate, totalWorkouts[i].name, Math.round(scoreStr * 100));
        }
        //a.push(scoreStr);a.push(sTooltipStr);
        if(scoreObj[totalWorkouts[i]['id']].status){
          a.push(scoreStr);a.push(sTooltipStr);a.push(null);
        }
        else{
          a.push(scoreStr);
          a.push(sTooltipStr);
          a.push('point {size:5;shape-type: star; fill-color: #a52714;}');
        }
      }
      else{
        var scoreStr = null;
        var sTooltipStr = null;
        a.push(scoreStr);a.push(sTooltipStr);a.push(null);
      }
//console.log(scoreStr);
    }
  }
  else {
      if(totalWorkouts.length == 0){
        a.push(null);a.push(null);a.push(null);
      }
      else{
        for(var i=0;i<totalWorkouts.length;i++){
          var scoreStr = "score"+totalWorkouts[i].id;
          var sTooltipStr = "sTooltip"+totalWorkouts[i].id;
          scoreStr = null;
          sTooltipStr = null;
          a.push(scoreStr);a.push(sTooltipStr);a.push(null);
        }
      }
  }
  return a;
}

function backfillData(data) {
  var today = new Date();
  var workingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  workingDate.setDate(workingDate.getDate() - 1);

  // backfill the data for the last 6 days so the chart renders nicely
  for (var i = 0; i < 6; i++) {
    if( totalWorkouts.length > 0 ) {
      var a = [workingDate, null, null];
      for(var j=0;j<totalWorkouts.length;j++){
        a.push(null);a.push(null);a.push(null)
      }
    } else {
      var a = [workingDate, null, null, null, null, null];
    }

    data.push(a);

    workingDate = new Date(workingDate);
    workingDate.setDate(workingDate.getDate() - 1);
  }

  return data;
}

function createKey(date) {
  return date.getFullYear() + '_' + date.getMonth() + '_' + date.getDate();
}

function calculatePercentage(key) {
  var percentage;
  var obj = workouts[key];

  if (obj !== undefined) {
    percentage = obj.numExercises / obj.maxExercises;
  } else {
    percentage = 0;
  }

  return percentage;
}

function createWeeklyAdherenceData() {
  var data = Array();
  var today = new Date();
  var workingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (var i = 0; i < 7; i++) {
    var key = createKey(workingDate);
    var percentage = calculatePercentage(key);

    var s = Math.round(percentage * 100);
    var tooltip = createTooltip(workingDate, 'Adherence', s);
    var a = [workingDate, percentage, tooltip];

    data.push(a);

    workingDate = new Date(workingDate);
    workingDate.setDate(workingDate.getDate() - 1);
  }

  return data;
}

function createTooltip(date, category, score) {
  return '<div style="width: 100px"><div><b>' + date.toDateString() + '</b></div><div>' + category + ': ' + score + '%</div></div>';
}

function getEarliestDate() {
  var date = new Date();

  if (Object.keys(workouts).length > 0) {
    var sortKeys = Object.keys(workouts).sort(naturalSort);
    var key = sortKeys[0];
    var obj = workouts[key];
    date = new Date(obj.year, obj.month, obj.day);
  }

  return date;
}

function getMinDrawDate() {
  // show the chart for at least 7 days
  var date = getEarliestDate();
  date.setDate(date.getDate() - 7);

  return date;
}

function drawOverallProgressChart(options) {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', 'Adherence');
  data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});

  if(totalWorkouts.length <= 1){
    data.addColumn('number', "Progress");
    data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
    data.addColumn({'type': 'string', 'role': 'style'});
  }
  else{
    for(var i=0;i<totalWorkouts.length;i++){
      data.addColumn('number', totalWorkouts[i]['name']);
      data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
      data.addColumn({'type': 'string', 'role': 'style'});
    }
  }
  var existing = processDateJoinedUntilNow(createOverallProgressGraphData);
  // if we're looking at the same day that the user joined, the chart won't render properly
  // so backfill it with empty data
  if (createKey(dateJoined) === createKey(new Date())) {
    existing = backfillData(existing);
  }

  var existingNew = [];
  var NoOfColumns = data.getNumberOfColumns();

  $.each( existing, function( key, value ) {
      if( value.length < NoOfColumns ) {
          for(var i=0; i<=parseInt(NoOfColumns - value.length); i++){
              value.push(null);
          }
          existingNew.push(value);
      } else {
          existingNew.push(value);
      }
  });
  existing = existingNew;

  data.addRows(existing);

  if (options === null) {
    options = {
      axisTitlesPosition: 'in',
      colors: ['#8bc53f', '#0da9f1', '#f00d68','#e86a10','#ffce00','#5f0d46','#007229'],
      chartArea: {left: '6%'},
      vAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, minValue: 0, maxValue: 1, format: '#%'},
      hAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, showTextEvery: 2, minValue: getMinDrawDate()},
      height: 300,
      backgroundColor: '#f1f1f2',
      legend: {position: 'top', alignment: 'end', textStyle: {fontSize: 10}},
      pointSize: 5,
      lineWidth: 1,
      interpolateNulls: true,
      seriesType: "line",
      series: {0: {type: "bars"}},
      tooltip: {isHtml: true}
    };
  }

  var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function drawWeeklyChart(options) {
  var weeklyWorkout = createWeeklyAdherenceData();
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', 'Adherence');
  data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
  data.addRows(weeklyWorkout);

  if (options === null) {
    options = {
      axisTitlesPosition: 'in',
      colors: ['#8bc53f'],
      chartArea: {left: '6%'},
      vAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, minValue: 0, maxValue: 1, format: '#%'},
      hAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, format: 'E'},
      height: 300,
      backgroundColor: '#f1f1f2',
      legend: {position: 'top', alignment: 'end', textStyle: {fontSize: 10}},
      seriesType: "bars",
      tooltip: {isHtml: true}
    };
  }

  var chart = new google.visualization.ColumnChart(document.getElementById('weekly_adherence_chart_div'));
  chart.draw(data, options);

  //var percentage = calculateWeeklyAdherencePercentage(weeklyWorkout);
  var percentage = weeklyAdherence;
  $('#weekly-score').html(percentage + '%');
}

function calculateWeeklyAdherencePercentage(weeklyWorkout) {
  var total = 0;
  for (var i = 0; i < weeklyWorkout.length; i++) {
    total = total + (weeklyWorkout[i][1] * 100);
  }

  var days = 7;
  var today = new Date();
  var earliest = getEarliestDate();

  var diff = today.getTime() - earliest.getTime();
  var oneDay = 24 * 60 * 60 * 1000;

  if (diff < (7 * oneDay)) {
    days = Math.floor(diff / oneDay) + 1;
  }

  return Math.round(total / days);
}

function onAjaxFinished(response) {
    workouts = $.parseJSON(response.workouts);
    weeklyAdherence = response.weeklyAdherence;
    drawOverallProgressChart(null);
    drawWeeklyChart(null);

    if (typeof response.hearts !== 'undefined') {
        var rows = 4;
        var cols = 7;
        for (var i = 0; i <= rows; i++) {
            var row = $('#heart_container_' + (i + 1));
            row.html('');

            for (var j = 1; j <= cols; j++) {
                var current = (i * cols) + j;
                if (current <= response.hearts) {
                    row.append('<span class="fa fa-heart"></span>');
                } else {
                    row.append('<span class="fa fa-heart-o"></span>');
                }
            }
        }
    }

    //var today = new Date();
    var objSelectedWorkoutDate = new Date( selectedWorkoutDate );
    var key   = createKey(objSelectedWorkoutDate);
    var percentage = calculatePercentage(key);

    if (percentage === 1) {
      var flashMessageDate = dayName[objSelectedWorkoutDate.getDay()]+", "+months[objSelectedWorkoutDate.getMonth()]+" "+objSelectedWorkoutDate.getDate();
      addFlashMessage("And you're done for "+flashMessageDate+". Great work!");
    }
}

$(function() {
    
    if (!($.isEmptyObject(workouts)) || !($.isEmptyObject(scores))) {
      drawOverallProgressChart(null);
    }

    if (!($.isEmptyObject(workouts))) {
      drawWeeklyChart(null);
    }
    if (typeof dailyHearts !== 'undefined') {
        var rows = 4;
        var cols = 7;
        for (var i = 0; i <= rows; i++) {
            var row = $('#heart_container_' + (i + 1));
            row.html('');

            for (var j = 1; j <= cols; j++) {
                var current = (i * cols) + j;
                if (current <= dailyHearts) {
                    row.append('<span class="fa fa-heart"></span>');
                } else {
                    row.append('<span class="fa fa-heart-o"></span>');
                }
            }
        }
    }

    $('ul.exercise-list li').each(function() {
        $(this).find('.comment').click( function(e) {
            e.stopPropagation();
        });
        $(this).find('.comment-box').click( function(e) {
            e.stopPropagation();
        });
        $(this).click(handleExerciseCheckboxClick($(this).find('.status'), true, onAjaxFinished));
    });

    if( typeof programStatus !== 'undefined' && programStatus != 1 ) {
        $('.exercise-li').css('pointer-events', 'none');
        $('.paper-workout').css('pointer-events', 'none');
        $('#survey_btn').css('pointer-events', 'none');
        $('#exercise_date').css('pointer-events', 'none');
        $('.mark_session_exercise').css('pointer-events', 'none');
        $('.mark_workout_exercise').css('pointer-events', 'none');
    }
});
