function getPatientWorkouts() {
    var path = window.location.pathname;
    var splitter = path.split('/');
    var id = splitter[splitter.length - 1];
    var data = {'workoutId': id};

    $.ajax({
        url: patientWorkoutURI,
        type: 'POST',
        data: data
    }).done(function (response) {
        var obj = $.parseJSON(response);

        var source = $("#printWorkout-template").html();
        var template = Handlebars.compile(source);
        var html = template(obj);

        $('#paper_workout').html(html);
    });
}