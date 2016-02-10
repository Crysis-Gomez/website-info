
function appendToWrapper(html){
	$('.website-info-wrapper').append(html);
}

function checkURL(url) {
  if(url.indexOf("http://www.mpgaruba.com/") > -1){
     return true;
  }
  return false;
}

function parseData(){

}

document.addEventListener('DOMContentLoaded', function () {

  chrome.storage.sync.get({}, function(items) {
    	document.getElementById('options').addEventListener("click",function(el){
      		var url = "chrome-extension://"+chrome.runtime.id+"/options/options.html";
      		chrome.tabs.create({ url: url });
   		});
  });

  $('#download-content').click(function(){
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
         if(checkURL(tabs[0].url)){
            chrome.tabs.sendMessage(tabs[0].id, {text: 'download'}, parseData);
         }else{
            var html = "<p>This is not a MPG website</p>";
            $('.website-info-wrapper').append(html);
         }
      });
  });
});



