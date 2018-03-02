function changeTemplateInjuryWorkoutForm( _this ) {
    if( _this.val() != "" ) {
        var injuryId        = parseInt( _this.val() );
        var boolInjuryFound = false;
        var showTemplates   = [];
        $.each( workoutTemplateInjuries, function( key, value ) {
            if( (value.join(',') ).indexOf( injuryId ) !== -1 ) { //console.log( value ); console.log( key );
                $('#addWorkout_workoutTemplate option').each( function() {
                    if( $(this).attr('value') == key ) {
                        showTemplates.push(key);
                    }
                });
            }
        });
        $('#addWorkout_workoutTemplate option').each( function() {
            if( $(this).attr('value') != "" && $.inArray( $(this).attr('value'), showTemplates ) === -1 ) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $('#addWorkout_workoutTemplate option').each( function() {
            if ($(this).attr('value') != "") {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }
}

function changeTemplateInjuryPatientForm(injuryId) {
    if( injuryId != "" ) {
        var boolInjuryFound = false;
        var showTemplates   = [];
        $.each( workoutTemplateInjuries, function( key, value ) {
            if( (value.join(',') ).indexOf( injuryId ) !== -1 ) { //console.log( value ); console.log( key );
                $('#addPatient_workoutTemplate option').each( function() {
                    if( $(this).attr('value') == key ) {
                        showTemplates.push(key);
                    }
                });
            }
        });
        $('#addPatient_workoutTemplate option').each( function() {
            if( $(this).attr('value') != "" && $.inArray( $(this).attr('value'), showTemplates ) === -1 ) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $('#addPatient_workoutTemplate option').each( function() {
            if ($(this).attr('value') != "") {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }
}