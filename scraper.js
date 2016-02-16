var zip = new JSZip();
var title;
var f = zip.folder("description");
var imgfolder = zip.folder("images");
var descriptionString = "";
var images;
var index = 0;
var dataCollection;

var imageDataSelector = '.main_image_table table a';
var titleSelector = '.mainContent .viewListingPage h1';
var commentsSelector = '.listingFeatures .fieldValueComments p';
var featuresSelector = '.listingFeatures ul li';
var listFeaturesSelector = '.viewListingPage ul li span';

var getMapData = function(frame){
   var frame = frame;
   var url = frame.contentWindow.location.href;
   var latitude;
   var longitude;

   $.get(url, function(data, status){
        latitude  = data.match("var latitude = (.*);");
        longitude = data.match("var longitude = (.*);");

        descriptionString += "<p>Map latitude: "+latitude[1]+"</p>";
        descriptionString += "<p>Map latitude: "+longitude[1]+"</p>";
    }).done(function(){
        getImageData();
    });
}

var getImage = function( index ){
    if(index >  images.length)return;
    if(index == images.length){
        getTitle();
        return;
    }else{
        img.src = images[index];
    }
}

var getImageData = function(){
  images = new Array();
  dataCollection = new Array();

   var data = jQuery(imageDataSelector).map(function() {
        return $(this).attr("href");
    });

   if(data != undefined && data != null){
        for (var i = 0; i < data.length; i++) {
              var url = data[i];
              images.push(url.toString());
        };
   }

   var html = ' <img style="visibility:hidden;" id="imageid" src=""><canvas style="visibility:hidden;"  id="imgCanvas" />';
   if(data.length > 0 && jQuery('#imageid'.length == 0)){
      jQuery('body').append(html);
   }

    can = document.getElementById("imgCanvas");
    img = document.getElementById("imageid");
    ctx = can.getContext("2d");

    $(img).load(function(){
        can.width = this.width;
        can.height = this.height;
        ctx.drawImage(img, 0, 0);

        var encodedBase = can.toDataURL("image/jpeg", 1.0);
         var imageData = encodedBase.replace("data:image/jpeg;base64,", '')

        dataCollection.push(imageData);
        index+=1;
        getImage(index);
    });

   getImage(index);
}

var getTitle = function(){
  title = jQuery(titleSelector).first().text();
  title = title.replace(/(\r\n|\n|\r)/gm,'');
  title = title.trim();
  title = title.replace(/\s+/g," ");
  descriptionString +=  jQuery(titleSelector).first().prop('outerHTML');

  getComments();
}

var getComments = function(){
  var commentsList = jQuery(commentsSelector);
  jQuery.each(commentsList,function(){
      descriptionString += jQuery(this).prop('outerHTML');
  });

  getFeatures();
}


var getFeatures = function(){
  var features = jQuery(featuresSelector);
  var html = "<ul>";
  jQuery.each(features,function(){
      html += jQuery(this).prop('outerHTML');
  });

  html += "</ul>";
  descriptionString += html;
  getList();
}

var getList = function(){
  var list = jQuery(listFeaturesSelector);

  var html = "<ul>";
  jQuery.each(list,function(){
    html += "<li>" +jQuery(this).prop('outerHTML') +"</li>";
  });

   html += "</ul>";
   descriptionString += html;

    for (var i = 0; i < dataCollection.length; i++) {
        var data = dataCollection[i];
        imgfolder.file(title+"picture"+i+".jpg", data ,{base64: true});
    };

     f.file("description.html",descriptionString);
     var content = zip.generate({type:"blob"});
    saveAs(content,  title+"textmpg.zip");
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'download') {
        var fr = jQuery('.fieldValueLocationOnMap iframe');

        if(fr != undefined && fr != null){
            getMapData(fr[0]);
        }else{
            getImageData();
        }
    }
});




