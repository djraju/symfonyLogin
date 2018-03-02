function getWeeklyChartOptions() {
  var width = $(window).width() * 0.9;

  var options = {
    axisTitlesPosition: 'none',
    colors: ['#8bc53f'],
    chartArea: {left: '12%', top: '10%', height: '75%', width: '90%'},
    vAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, minValue: 0, maxValue: 1, format: '#%'},
    hAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, format: 'E'},
    width: width,
    backgroundColor: '#f1f1f2',
    legend: {position: 'none'},
    seriesType: "bars",
    tooltip: {isHtml: true}
  };

  return options;
}

function getOverallChartOptions() {
  var width = $(window).width() * 0.9;

  var options = {
    axisTitlesPosition: 'none',
    colors: ['#8bc53f', '#0da9f1', '#f00d68','#e86a10','#ffce00','#5f0d46','#007229'],
    chartArea: {left: '12%', top: '10%', height: '75%', width: '90%'},
    vAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, minValue: 0, maxValue: 1, format: '#%'},
    hAxis: {baselineColor: '#d7d7d9', gridlines: {color: '#d7d7d9'}, textStyle: {color: '#b3b3b3'}, showTextEvery: 2, minValue: getMinDrawDate()},
    width: width,
    backgroundColor: '#f1f1f2',
    legend: {position: 'none'},
    pointSize: 5,
    lineWidth: 1,
    interpolateNulls: true,
    seriesType: "line",
    series: {0: {type: "bars"}},
    tooltip: {isHtml: true}
  };

  return options;
}

function getProgressInfo(url) {
  $.ajax({
    url: url,
    type: 'GET'
  }).done(function(response) {
    var obj = $.parseJSON(response);

    workouts = obj.workouts;
    scores = obj.scores;
    dateJoined = new Date(obj.dateJoined * 1000);
    totalWorkouts = obj.totalWorkouts;
    weeklyAdherence = obj.weeklyAdherence;

    drawOverallProgressChart(getOverallChartOptions());
    drawWeeklyChart(getWeeklyChartOptions());

    var rank = obj.rank;
    $('#ranking').html(rank.rank);
    $('.total-ranking').html(rank.numPatients);

    if (obj.lastScore !== null) {
      $('#progress-score').html(obj.lastScore + '%');
    }
  });
}
