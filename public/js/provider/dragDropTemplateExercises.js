function addExerciseToSession(sessionNo, matches){
    var exercise = availableExercises[matches[0]]; //console.log( exercise.exercise );
    exercise.sessionNo = sessionNo;
    var obj = {"exercise": exercise};

    var sessionExercises = $('#sessionExercises').val();
    $('#sessionExercises').val( sessionExercises+','+sessionNo+'_'+matches[0]);
    $('#editWorkoutTemplateForm').addClass('dirty');
    $('#editWorkoutTemplateForm').find('button[type=submit]').removeAttr('disabled');
    $('#editWorkoutTemplateForm').find('button[type=submit]').removeClass('disable');
    var templateInjuries = "";
    if( $('#editWorkoutTemplate_programInjury').val() != "" && $('#editWorkoutTemplate_programInjury').val() != null ) {
        templateInjuries = ( $('#editWorkoutTemplate_programInjury').val() ).join(',');
    }

    $('#templateInjuries').val( templateInjuries );

    var source = $("#exercise-template").html();
    var template = Handlebars.compile(source);
    var html = template(obj);

    $("#"+sessionNo).find("#sessions_programs").append(html);
    $("#library"+matches).hide();

    var winHeight = $(window).height();
    $(document).find('.exerciseModal').find('.modal-content').css( 'height', ( winHeight - 150 ) + 'px' );

    var exerciseIds = [];
    $("#"+sessionNo).find("#sessions_programs > div").each(function(){
        var exerciseIdStr = $(this).attr('id');
        var numberRegex = /\d+/g;
        exerciseIds.push(exerciseIdStr.match(numberRegex));
    });

    $("#"+sessionNo).find("#sessions_programs").find('.exerciseModal').each(function() {
        var parentElement = $(this);
        $(this).parent().find('a.subheader').click(function (e) {
            parentElement.modal();
        });
        var ids = ( $(this).parent().attr('id') ).split('exercises');
        if( ids.length > 0 && !$.trim(parentElement.find(".modal-body").html()) ) {
            var source   = $("#modal-template").html();
            var template = Handlebars.compile(source);
            var html     = template(obj);

            parentElement.find(".modal-body").append(html);
            var stepCount = $("#"+sessionNo).find("#sessions_programs").find('#exerciseSteps' + ids[1]).find('.exerciseModalSlider').find('.overview').find('li').length;
            if( stepCount > 1 ) {
                $("#"+sessionNo).find("#sessions_programs").find('#exerciseSteps' + ids[1]).find('.exerciseModalSlider').tinycarousel({ interval: true, bullets: true });
            }
        }
    });

    rebuildSessionExercisesStr();
}

$(function () {
    Handlebars.registerHelper('repTypeSelected', function(repType) {
        var repsArr = ["reps","seconds","minutes"];
        var retStr = "";
        for(var i=0; i<repsArr.length; i++){
              var selectedVal = "";
              if(typeof(repType) == "string" && repsArr[i] === repType.toLowerCase()){
                selectedVal = "selected";
              }
              retStr+="<option "+selectedVal+" value='"+repsArr[i]+"'>"+repsArr[i]+"</option>";
        }
        return new Handlebars.SafeString(retStr);
    });


  $("#exercise_container div.exercise-item").click(function(e){
    if(e.shiftKey){
        if( $(this).hasClass('exerciseItemShadow') ) return;
      var currSelected = $(this).attr('id');
      var currSelectedIndex = $(this).index();

      var markExSelected = 0;
      if($("#exercise_container div.exercise-item.exerciseItemShadow").length >= 1){

        var lastSelectedEx = $("#exercise_container div.exercise-item.exerciseItemShadow").last().attr('id');
        var lastSelectedExIndex = $("#exercise_container div.exercise-item.exerciseItemShadow").last().index();
        if(currSelectedIndex<lastSelectedExIndex){
            var minSelectedIndex = $("#exercise_container div.exercise-item.exerciseItemShadow").first().index();
            var minSelectedId = $("#exercise_container div.exercise-item.exerciseItemShadow").first().attr('id');

          $("#exercise_container div.exercise-item").each(function(){
            if(markExSelected == 1){
              if(!($(this).css('display') == 'none')){
                $(this).addClass('exerciseItemShadow');
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
              if(!($(this).css('display') == 'none')){
                $(this).addClass('exerciseItemShadow');
              }
            }
          });

        }
        else{
          $("#exercise_container div.exercise-item").each(function(){
            if(markExSelected == 1){
              if(!($(this).css('display') == 'none')){
                $(this).addClass('exerciseItemShadow');
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
        $(this).addClass("exerciseItemShadow");
      }

    }
    else if(e.ctrlKey){
        if($(this).hasClass("exerciseItemShadow")) {
            $(this).removeClass("exerciseItemShadow");
        } else {
            $(this).addClass("exerciseItemShadow");
        }
    }
    else{
      $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
          $(this).removeClass('exerciseItemShadow');
      });
      $(this).addClass("exerciseItemShadow");

    }
  });


  $("#exercise_container div.exercise-item").draggable({
      revert: "invalid",
      refreshPositions: true,
      containment: 'document',
      cursor: "move",
      cursorAt: { left: 100, top: 30 },
      helper: function (){
          if( !$(this).hasClass('exerciseItemShadow') ) {
              $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
                  $(this).removeClass('exerciseItemShadow');
              });
              $(this).addClass('exerciseItemShadow');
              var selected = $("#exercise_container div.exercise-item.exerciseItemShadow");
              var container = $('<div/>').attr('id','draggingContainer');
              container.css({"background-color":"#0da9f1", "z-index":"999999", "position": "fixed"});
              var exerciseTitle = selected.find("span.excerise-title a.subheader").text();
              var exerciseSets = selected.find("span.exercise-sets").text();
              container.append('<div><span style="color: #ffffff;">'+exerciseTitle+'</span><br><span style="color: #ffffff;">'+exerciseSets+'</span></div>');
              return container;
          } else {
              var selected = $("#exercise_container div.exercise-item.exerciseItemShadow");
              if(selected.length>1){
                  var container = $('<div/>').attr('id','draggingContainer');
                  container.css({"background-color":"#0da9f1", "z-index":"999999", "position": "fixed"});
                  var str = '';
                  $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
                    var exerciseTitle = $(this).find("span.excerise-title a.subheader").text();
                    var exerciseSets = $(this).find("span.exercise-sets").text();
                    if(str == ''){
                      str = '<div><span style="color: #ffffff;">'+exerciseTitle+'</span><br><span style="color: #ffffff;">'+exerciseSets+'</span></div>';
                    }
                    else{
                      str = str.concat('<hr/><div><span style="color: #ffffff;">'+exerciseTitle+'</span><br><span style="color: #ffffff;">'+exerciseSets+'</span></div>');
                    }
                  });
                  container.append(str);
                  return container;
              }
              else{
                  $(this).addClass('exerciseItemShadow');
                  var selected = $("#exercise_container div.exercise-item.exerciseItemShadow");
                  var container = $('<div/>').attr('id','draggingContainer');
                  container.css({"background-color":"#0da9f1", "z-index":"999999", "position": "fixed"});
                  var exerciseTitle = selected.find("span.excerise-title a.subheader").text();
                  var exerciseSets = selected.find("span.exercise-sets").text();
                  container.append('<div><span style="color: #ffffff;">'+exerciseTitle+'</span><br><span style="color: #ffffff;">'+exerciseSets+'</span></div>');
                  return container;
              }
          }
      },
      drag: function (event, ui) {
          ui.helper.addClass("draggable");
          ui.helper.addClass("exerciseItemShadow");
      },
      stop: function (event, ui) {
              ui.helper.removeClass("draggable");
              ui.helper.removeClass("exerciseItemShadow");
              ui.helper.removeAttr('style')
      }
  });


  $("#1").droppable({
      hoverClass:"drop-hover",
      drop: function (event, ui) {

          if(ui.draggable.parent().attr('id') == "exercise_container"){
                var exerciseIds = [];
                $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){

                  if($(this).parent().attr('id') == 'exercise_container'){
                    exerciseStr  = $(this).attr('id');
                    var numberRegex = /\d+/g;
                    var matches = exerciseStr.match(numberRegex);
                    exerciseIds.push(matches);
                    addExerciseToSession("1",matches);
                    $(this).removeClass('exerciseItemShadow');
                  }
                });
          }
      }
  });

  $( "#1" ).find("#sessions_programs").sortable({
    cursor: "move",
    connectWith: ".connectedSortable",
    containment: 'parent',
    axis: 'y',
    scroll: true,
    scrollSensitivity: 50,
    scrollSpeed: 1,
    cursorAt: {left: 5,top: 5},
    helper: 'clone',
    start: function(event, ui){
      $(ui.helper).addClass("yellow");
    },
    stop:function (event, ui) {
        var listElements = $(this).children();
        var exerciseIds = [];
        $.each(listElements,function(index,item){
          var exerciseIdStr = item.id;
          var numberRegex = /\d+/g;
          exerciseIds.push(exerciseIdStr.match(numberRegex));
        });
        $(ui.helper).removeClass("yellow");
        rebuildSessionExercisesStr();
      },
  }).disableSelection();

  $("#2").droppable({
      hoverClass:"drop-hover",
      drop: function (event, ui) {
          if(ui.draggable.parent().attr('id') == "exercise_container"){
            var exerciseIds = [];
            $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
              if($(this).parent().attr('id') == 'exercise_container'){
                exerciseStr  = $(this).attr('id');
                var numberRegex = /\d+/g;
                var matches = exerciseStr.match(numberRegex);
                exerciseIds.push(matches);
                addExerciseToSession("2",matches);
                $(this).removeClass('exerciseItemShadow');
              }
            });
        }
      }
  });

  $( "#2" ).find("#sessions_programs").sortable({
    cursor: "move",
    connectWith: ".connectedSortable",
    containment: 'parent',
    axis: 'y',
    scroll: true,
    scrollSensitivity: 50,
    scrollSpeed: 1,
    cursorAt: {left: 5,top: 5},
    helper: 'clone',
    start: function(event, ui){
      $(ui.helper).addClass("yellow");
    },
    stop:function (event, ui) {
        var listElements = $(this).children();
        var exerciseIds = [];
        $.each(listElements,function(index,item){
          var exerciseIdStr = item.id;
          var numberRegex = /\d+/g;
          exerciseIds.push(exerciseIdStr.match(numberRegex));
        });
        $(ui.helper).removeClass("yellow");
        rebuildSessionExercisesStr();
      },
  }).disableSelection();

  $("#3").droppable({
      hoverClass:"drop-hover",
      drop: function (event, ui) {
          if(ui.draggable.parent().attr('id') == "exercise_container"){
            var exerciseIds = [];
            $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
              if($(this).parent().attr('id') == 'exercise_container'){
                exerciseStr  = $(this).attr('id');
                var numberRegex = /\d+/g;
                var matches = exerciseStr.match(numberRegex);
                exerciseIds.push(matches);
                $(this).removeClass('exerciseItemShadow');
              }
            });
        }
      }
  });

  $( "#3" ).find("#sessions_programs").sortable({
    cursor: "move",
    connectWith: ".connectedSortable",
    containment: 'parent',
    axis: 'y',
    scroll: true,
    scrollSensitivity: 50,
    scrollSpeed: 1,
    cursorAt: {left: 5,top: 5},
    helper: 'clone',
    start: function(event, ui){
      $(ui.helper).addClass("yellow");
    },
    stop:function (event, ui) {
        var listElements = $(this).children();
        var exerciseIds = [];
        $.each(listElements,function(index,item){
          var exerciseIdStr = item.id;
          var numberRegex = /\d+/g;
          exerciseIds.push(exerciseIdStr.match(numberRegex));
        });
        $(ui.helper).removeClass("yellow");
        rebuildSessionExercisesStr();
      },
  }).disableSelection();

  $("#4").droppable({
      hoverClass:"drop-hover",
      drop: function (event, ui) {
          if(ui.draggable.parent().attr('id') == "exercise_container"){
            var exerciseIds = [];
            $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
              if($(this).parent().attr('id') == 'exercise_container'){
                exerciseStr  = $(this).attr('id');
                var numberRegex = /\d+/g;
                var matches = exerciseStr.match(numberRegex);
                exerciseIds.push(matches);
                $(this).removeClass('exerciseItemShadow');
              }
            });
        }
      }
  });

  $( "#4" ).find("#sessions_programs").sortable({
    cursor: "move",
    connectWith: ".connectedSortable",
    containment: 'parent',
    axis: 'y',
    scroll: true,
    scrollSensitivity: 50,
    scrollSpeed: 1,
    cursorAt: {left: 5,top: 5},
    helper: 'clone',
    start: function(event, ui){
      $(ui.helper).addClass("yellow");
    },
    stop:function (event, ui) {
        var listElements = $(this).children();
        var exerciseIds = [];
        $.each(listElements,function(index,item){
          var exerciseIdStr = item.id;
          var numberRegex = /\d+/g;
          exerciseIds.push(exerciseIdStr.match(numberRegex));
        });
        $(ui.helper).removeClass("yellow");
        rebuildSessionExercisesStr();
      },
  }).disableSelection();

  $("#5").droppable({
      hoverClass:"drop-hover",
      drop: function (event, ui) {
          if(ui.draggable.parent().attr('id') == "exercise_container"){
            var exerciseIds = [];
            $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
              if($(this).parent().attr('id') == 'exercise_container'){
                exerciseStr  = $(this).attr('id');
                var numberRegex = /\d+/g;
                var matches = exerciseStr.match(numberRegex);
                exerciseIds.push(matches);
                $(this).removeClass('exerciseItemShadow');
              }
            });
        }
      }
  });

  $( "#5" ).find("#sessions_programs").sortable({
    cursor: "move",
    connectWith: ".connectedSortable",
    containment: 'parent',
    axis: 'y',
    scroll: true,
    scrollSensitivity: 50,
    scrollSpeed: 1,
    cursorAt: {left: 5,top: 5},
    helper: 'clone',
    start: function(event, ui){
      $(ui.helper).addClass("yellow");
    },
    stop:function (event, ui) {
        var listElements = $(this).children();
        var exerciseIds = [];
        $.each(listElements,function(index,item){
          var exerciseIdStr = item.id;
          var numberRegex = /\d+/g;
          exerciseIds.push(exerciseIdStr.match(numberRegex));
        });
        $(ui.helper).removeClass("yellow");
        rebuildSessionExercisesStr();
      },
  }).disableSelection();

  $(document).on('click','.exercise-remove', function(){
        var removeExerciseEleId = $(this).attr('id');
        var removeExerciseArr = removeExerciseEleId.split("_");
        var exercisesCnt = $("#"+removeExerciseArr[2]+" div[id=sessions_programs]").find("div.exercises-choosen").length;
        var sessionsCnt = $("#current_exercises").find("ul.nav-tabs").children().length - 1 ;
        var session_exercise = removeExerciseArr[2]+"_"+removeExerciseArr[1];

        if(exercisesCnt == 1 && sessionsCnt > 1 ){
              var modal = $('#myModal');
              $('#myModal p').html("This is the last exercise in this session. Removing this exercise will remove the session. Are you sure ?");
              $('#session-number').val(removeExerciseArr[2]);
              modal.modal("show");
        }
        else {
            $(this).parent().remove();
            var sessionExercises    = ( $('#sessionExercises').val() ).split(',');
            var newsessionExercises = "";
            $.each( sessionExercises, function(key, value ) {
                if( session_exercise != "" && value != session_exercise ) {
                    newsessionExercises += value + ",";
                }
            });
            $('#sessionExercises').val( newsessionExercises );
            $('#sessionExercises').parent('form').addClass('dirty');
            $('#sessionExercises').parent('form').find('button[type=submit]').removeAttr('disabled');
            $('#sessionExercises').parent('form').find('button[type=submit]').removeClass('disable');
            showAvailableExercises();
        }
  });

    $(document).on('click', '.session-remove', function() {
        var sessionNo = $(this).data('session');
        var exercisesCnt = $("#"+sessionNo+" div[id=sessions_programs]").find("div.exercises-choosen").length;
        var sessionsCnt = $("#current_exercises").find("ul.nav-tabs").children().length - 1 ;
        if((sessionsCnt == 1 && exercisesCnt > 0) || (sessionsCnt > 1)) {
            $('#session-number').val($(this).data('session'));
            var modal = $('#myModal');
            var modal_title = 'Delete Session' + $(this).data('session');
            $('#myModal h4').html(modal_title);
            $('#myModal p').html("Are you sure ?");
            modal.modal("show");
        }
    });
    $(document).on('click','#remove-session', function(){
        delSessionNo = $('#session-number').val();

        $('#addNewSession').show();

        var allNextSessions = $('#sessionLi'+delSessionNo).nextAll();
        $('#sessionLi'+delSessionNo).remove();
        $.each( allNextSessions, function( key, liObj ) {
            if( $(liObj).attr('id') != "addNewSession" ) {
                var ElementId = ( $(liObj).attr('id') ).split('sessionLi');
                $(liObj).attr( 'id', 'sessionLi' + ( parseInt( ElementId[1] ) - 1 ) );
                $(liObj).find('a').attr('href', '#' + ( parseInt( ElementId[1] ) - 1 ) );
                $(liObj).find('a').find('span').attr('data-session', parseInt( ElementId[1] ) - 1 );
                var anchorElement = $(liObj).find('a').find('span');
                $(liObj).find('a').html( parseInt( ElementId[1] ) - 1 );
                $(liObj).find('a').append( anchorElement );
            }
        });

        var allNextSessionDivs = $('#sessions_tabs').parent().siblings('div.tab-content').find('div#'+delSessionNo).nextAll();
        $('#sessions_tabs').parent().siblings('div.tab-content').find('div#'+delSessionNo).remove();
        $.each( allNextSessionDivs, function( key, divObj ) {
            var divId = parseInt( $(divObj).attr('id') ) - 1;
            $(divObj).attr('id', divId);
            var allInnerDivs = $(divObj).find('#sessions_programs').find('div.exercises-choosen');
            $.each( allInnerDivs, function( key1, innerDivObj ) {
                var removeSessionIds = ( $(innerDivObj).find('.exercise-remove').attr('id') ).split('_');
                if( removeSessionIds.length == 3 ) {
                    var newId = removeSessionIds[0]+"_"+removeSessionIds[1]+"_"+divId;
                    $(innerDivObj).find('.exercise-remove').attr('id', newId);
                }

                $(innerDivObj).find('.exercise-sets').find('input[type=number]').each( function() {
                    var inputNames = ( $(this).attr('name') ).split('_');
                    $(this).attr('name', inputNames[0]+"_"+inputNames[1]+"_"+divId);
                });

                var selectNames = ( $(innerDivObj).find('.exercise-sets').find('select').attr('name') ).split('_');
                $(innerDivObj).find('.exercise-sets').find('select').attr('name', selectNames[0]+"_"+selectNames[1]+"_"+divId);

                var inputNames = ( $(innerDivObj).find('input[type="text"]').attr('name') ).split('_');
                $(innerDivObj).find('input[type="text"]').attr('name', inputNames[0]+"_"+inputNames[1]+"_"+divId );
            });
            bindDropAndSortEventHandlers(divId);
        });

        newSessionTab = delSessionNo - 1;
        if( newSessionTab == 0 ) {
            newSessionTab = 1;
        }

        $('.nav-tabs a[href="#'+newSessionTab+'"]').tab('show');
        $('.nav-tabs a[href="#'+newSessionTab+'"]').parent().addClass('active');
        $('.nav-tabs a[href="#'+newSessionTab+'"]').parent().siblings().removeClass('active');

        var existingTabsLen = ($('#current_exercises .nav-tabs li').length - 1);
        $("#addNewSession").attr("data-current", existingTabsLen);

        $('#sessionExercises').parent('form').addClass('dirty');
        $('#sessionExercises').parent('form').find('button[type=submit]').removeAttr('disabled');
        $('#sessionExercises').parent('form').find('button[type=submit]').removeClass('disable');
        rebuildSessionExercisesStr();
    });
  $(document).on('click','#addNewSession', function(){
      var newSessionTabNo = parseInt( $(this).attr('data-current') ) + 1;
      var newSessionLi = '<li id="sessionLi'+newSessionTabNo+'"><a href="#'+newSessionTabNo+'" data-toggle="tab">'+newSessionTabNo+'<span data-target="#myModal" data-session="'+newSessionTabNo+'" class="pull-right fa fa-remove session-remove" style="font-size:13px;margin-left:10px;"></span></a></li>';
      var newSessionDiv = '<div id="'+newSessionTabNo+'" class="clearfix tab-pane ui-droppable"><div id="sessions_programs" class="col-md-12 clearfix tab-pane ui-sortable sessionPrograms"></div></div>';

      if( parseInt( $(this).attr('data-current') ) > 0 ) {
          $(newSessionLi).insertAfter('#sessionLi'+parseInt( $(this).attr('data-current') ));
          $(newSessionDiv).insertAfter('#'+parseInt( $(this).attr('data-current') ));
      } else {
          $(newSessionLi).insertBefore($(this));
          $('#sessions_tabs').parent().siblings('div.tab-content').html(newSessionDiv);
      }

      if(newSessionTabNo == 5){
         $(this).hide();
      }
      else{
          $(this).attr('data-current',newSessionTabNo);
      }
      // Since the new session is created dynamically, we have to bind the droppable event
      bindDropAndSortEventHandlers(newSessionTabNo);

      $('.nav-tabs a[href="#'+newSessionTabNo+'"]').tab('show');
      $('.nav-tabs a[href="#'+newSessionTabNo+'"]').parent().addClass('active');
      $('.nav-tabs a[href="#'+newSessionTabNo+'"]').parent().siblings().removeClass('active');
      $('#editWorkout_sessionTab').val(newSessionTabNo);
      showAvailableExercises();
      changeHeight();
    });

    $(document).on('click', '#sessions_tabs li', function() {
        if($(this).attr('id') != "addNewSession") {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }
    });

 });

function bindDropAndSortEventHandlers(newSessionTabNo){
  $("#"+newSessionTabNo).droppable({
        hoverClass:"drop-hover",
          drop: function (event, ui) {
              if(ui.draggable.parent().attr('id') == "exercise_container"){
                var exerciseIds = [];
                $("#exercise_container div.exercise-item.exerciseItemShadow").each(function(){
                  if($(this).parent().attr('id') == 'exercise_container'){
                    exerciseStr  = $(this).attr('id');
                    var numberRegex = /\d+/g;
                    var matches = exerciseStr.match(numberRegex);
                    exerciseIds.push(matches);
                    addExerciseToSession(newSessionTabNo,matches);
                    $(this).removeClass('exerciseItemShadow');
                  }
                });
            }
          }
      });

      $( "#"+newSessionTabNo).find("#sessions_programs").sortable({
        cursor: "move",
        connectWith: ".connectedSortable",
        containment: 'parent',
        axis: 'y',
        scroll: true,
        scrollSensitivity: 50,
        scrollSpeed: 1,
        cursorAt: {left: 5,top: 5},
        helper: 'clone',
        start: function(event, ui){
          $(ui.helper).addClass("yellow");
        },
        stop:function (event, ui) {
            var listElements = $(this).children();
            var exerciseIds = [];
            $.each(listElements,function(index,item){
              var exerciseIdStr = item.id;
              var numberRegex = /\d+/g;
              exerciseIds.push(exerciseIdStr.match(numberRegex));
            });
            $(ui.helper).removeClass("yellow");
            rebuildSessionExercisesStr();
          }
      }).disableSelection();
}

function rebuildSessionExercisesStr(){
  var allSessionExercisesStrNew = "";
  var numberRegex = /\d+/g;
  $("#current_exercises .tab-content").children("div").each(function(){
      sessionNo = $(this).attr("id");
      var sessionExercisesStr = "";
      $(this).find("div.exercises-choosen").each(function(){
        var _this = $(this);
        var exerciseIdStr = _this.attr('id');        
        var exerciseId = exerciseIdStr.match(numberRegex);
        if(sessionExercisesStr == ""){
          sessionExercisesStr = sessionNo+"_"+exerciseId;
        } else {
          sessionExercisesStr = sessionExercisesStr+","+sessionNo+"_"+exerciseId;
        }
      });
      if(allSessionExercisesStrNew == ""){
        allSessionExercisesStrNew = sessionExercisesStr;
      }
      else{
        allSessionExercisesStrNew = allSessionExercisesStrNew+","+sessionExercisesStr;
      }
  });
  $('#sessionExercises').val(allSessionExercisesStrNew);
}