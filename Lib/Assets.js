function Assets(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', ".glitch-assets", true);
  var self = this;  
  self.elements=[];
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var str = this.response.split("\n").join(",\n");
      var elems = JSON.parse('{"elems":[' + str + "{}]}").elems;
      for( var i=0;i<elems.length;++i){
        if(elems[i].deleted!=undefined){
          console.log( ">> "+ elems[i].date );
          self.elements[elems[i].name]  = elems[i].url;
        }
      }
      console.log( ">> "+ self.elements.length );
    }
    self.then(self);
    mainScene.Loader.Pop(self);
  }
  xhr.send();
}

Assets.prototype.getURL = function(name){
  if(window.location.href =="https://dice-gl.glitch.me/")
    return this.elements[name];  
return "Assets/"+name;
}