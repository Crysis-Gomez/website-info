
function save(){

  var sunday_service = document.getElementById('sunday_service').checked;
  var roast_n_toast = document.getElementById('roast_n_toast').checked;
  var movie_review_extravaganza = document.getElementById('movie_review_extravaganza').checked;
  var movie_review = document.getElementById('movie_review').checked;

  chrome.storage.sync.set({
    sunday_service: sunday_service,
    roast_n_toast:roast_n_toast,
    movie_review_extravaganza:movie_review_extravaganza,
    movie_review:movie_review
  }, function() {
  
    });
}

function restore_options() {
  chrome.storage.sync.get({
    sunday_service: true,
    roast_n_toast:true,
    movie_review_extravaganza:true,
    movie_review:true
  }, function(items) {
    document.getElementById('sunday_service').checked = items.sunday_service ;
    document.getElementById('roast_n_toast').checked = items.roast_n_toast;
    document.getElementById('movie_review_extravaganza').checked = items.movie_review_extravaganza;
    document.getElementById('movie_review').checked = items.movie_review;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
var el = document.getElementsByClassName('cmn-toggle');
for (var i = 0; i < el.length; i++) {
     var obj = el[i];
     obj.addEventListener('click',save);
};