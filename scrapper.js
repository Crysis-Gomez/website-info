var response;

var getMapData = function(frame){
   var frame = frame;
   var url = frame.contentWindow.location.href;
   var latitude;
   var longitude;

   $.get(url, function(data, status){
        latitude  = data.match("var latitude = (.*);");
        longitude = data.match("var longitude = (.*);");
        response += '{"Map latitude":"'+ latitude[1] +'"},';
        response += '{"Map longitude":"'+ longitude[1] +'"},';
        debugger;    
    }).done(function(){
        getImageData();
    });
}


var getImageData = function(){
   
   var data = jQuery('.indusskieKoderyMudaki a').map(function() {
        return $(this).attr("href");
    });
   
   if(data != undefined && data != null){
        for (var i = 0; i < data.length; i++) {
              var url = data[i];
              response += '{"Image URL":"'+url.toString()+'"},';
        };
   }

   getTitle();   
}

var getTitle = function(){
  var title = jQuery('.mainContent .viewListingPage h1').first().text();
  title = title.replace(/(\r\n|\n|\r)/gm,'');
  test = title.trim();
  test = test.replace(/\s+/g," ");
  response += '{"Property Info":"'+test+'"},';
  
  getComments(); 
}

var getComments = function(){
  var commentsList = jQuery('.listingFeatures.propertyFeatures .fieldValueComments p');
  jQuery.each(commentsList,function(){
      var comment = jQuery(this).text();
      comment = comment.replace(/(\r\n|\n|\r)/gm,'');
      response += '{"Property Comments":"'+comment.toString().trim()+'"},';
  });

  getFeatures();
}


var getFeatures = function(){
  var features = jQuery('.listingFeatures ul li');
  
  jQuery.each(features,function(){
      var feature = jQuery(this).text();
      debugger;
      feature = feature.replace(/(\r\n|\n|\r)/gm,'');
      response += '{"Property feature":"'+feature.toString().trim()+'"},';
  });

  getList();
}

var getList = function(){
  var list = jQuery('.viewListingPage ul li span');
  for (var i = 0; i < list.length; i++) {
    var span = list[i];
    var value = jQuery(span).text();
    response += '{"Property Info":"'+value.toString()+'"},';
  };

   response = response.substring(0,response.length -1);
   response += ']}';

   respondMessage();
}

var respondMessage = function(){
    chrome.runtime.sendMessage(response, function(response) {});
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.text === 'download') {
        response = '{"info" : [';
        var fr = jQuery('.fieldValueLocationOnMap iframe');
        
        if(fr != undefined && fr != null){
            getMapData(fr[0]);
            debugger;
        }else{
            getImageData();
        }      
    }
});




