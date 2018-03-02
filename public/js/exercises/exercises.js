function toggleExerciseCheckbox(node) {
      var unchecked = 'fa-square-o';
      var checked = 'fa-check-square-o';
    
      var iconSpan = node.find('.fa.fa-square-o');
    
      if (iconSpan.length === 0) {
        iconSpan = node.find('.fa.fa-check-square-o');
      }
    
      iconSpan.toggleClass(unchecked);
      iconSpan.toggleClass(checked);
}

function removeExercise(removeExerciseURL){
    $.ajax({
        url: removeExerciseURL,
        type: 'GET'
    }).done(function(response) {
        location.reload();
    });
}


