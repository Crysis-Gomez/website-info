var canvas;
var img;
var ctx;
var dataCollection;
var count = 0;
var total = 0;
var index = 0;
var obj;
var mapCordinates;
var images;
var PropertyInfo;
var comments;
var features;

"hello\n"

function loadImages(){
    var zip = new JSZip();
    var img = zip.folder("images");
    var f = zip.folder("description");
    var descriptionString = "";
    if(mapCordinates.length > 0){
        descriptionString += "Map latitude: "+mapCordinates[0]+"\n"+"Map longitude: "+mapCordinates[1];
    }

    for (var i = 0; i < PropertyInfo.length; i++) {
         var data = PropertyInfo[i];
         descriptionString +="\n"+data+"";
    };

    for (var i = 0; i < features.length; i++) {
        if(i == 0){
            descriptionString +="\n\n"+"Property features";
        }
        var data = features[i];
        descriptionString +="\n"+data+"";
    };


    for (var i = 0; i < comments.length; i++) {
        if(i == 0){
            descriptionString +="\n"+"Comments";
        }
        var data = comments[i];
        descriptionString +="\n"+data+"";
    };

    f.file("description.txt",descriptionString);

    for (var i = 0; i < dataCollection.length; i++) {
        var data = dataCollection[i];
        img.file("picture"+i+".jpg", data ,{base64: true});
    };

    var content = zip.generate({type:"blob"});
    saveAs(content, "mpg.zip");
}

function getImage( index ){

    if(index >  images.length)return;

    if(index == images.length){
        loadImages();
        return;
    }else{
        img.src = images[index];
    }

}

function fillInformation(){
   for (var i = 0; i < obj.info.length; i++) {
       var info =  obj.info[i];
       if(info["Image URL"]){
            images.push(info["Image URL"]);
       }else if(info["Map latitude"]){
            mapCordinates.push(info["Map latitude"]);
       }else if(info["Map longitude"]){
            mapCordinates.push(info["Map longitude"]);
       }else if(info["Property Info"]){
            PropertyInfo.push(info["Property Info"]);
       }else if(info["Property Comments"]){
            comments.push(info["Property Comments"]);
       }else if(info["Property feature"]){
            features.push(info["Property feature"]);
       }
   };
   getImage(index);
}

function initialize(){
    count = 0;
    total = 0;
    index = 0;
    obj;
    mapCordinates = new Array();
    images = new Array();
    PropertyInfo = new Array();
    comments = new Array();
    features = new Array();
}
var frame;

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

    initialize();

    var html = ' <img id="imageid" src=""><canvas id="imgCanvas" />';
    console.log(message);
    if( $('#imageid').length == 0 ){
         $('body').append(html);
    }

    var test = message;
    obj = JSON.parse(message);

    total = Object.keys(obj.info).length;
    dataCollection = new Array();
    can = document.getElementById("imgCanvas");
    img = document.getElementById("imageid");
    ctx = can.getContext("2d");

    fillInformation();

    $(img).load(function(){
        can.width = this.width;
        can.height = this.height;
        ctx.drawImage(img, 0, 0);

        console.log("event Triggered",index);


        var encodedBase = can.toDataURL();
        var imageData = encodedBase.replace(/^data:image\/(png|jpg);base64,/, '')

        dataCollection.push(imageData);
        index+=1;

        getImage(index);
    });
});
