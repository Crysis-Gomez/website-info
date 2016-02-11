
function save(){

  var title_selector = document.getElementById('title_selector').value;
  chrome.storage.sync.set({
    title_selector: title_selector,
  }, function() {

    });
}

function restore_options() {
  chrome.storage.sync.get({
    title_selector: ".mainContent .viewListingPage h1",
  }, function(items) {
      document.getElementById('title_selector').value =items.title_selector;

  });
}

document.addEventListener('DOMContentLoaded', restore_options);

var el = document.getElementsByClassName('cmn-button');
for (var i = 0; i < el.length; i++) {
     var obj = el[i];
     obj.addEventListener('click',save);
};