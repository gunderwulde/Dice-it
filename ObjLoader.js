function LoadObject(url){
  var r = new FileReader();
  r.onload = function(e){
    console.log("listo!");
  };
  r.readAsText(url);
}