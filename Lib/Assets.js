function Assets(){
  if(window.location.href =="https://dice-gl.glitch.me/"){
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

          self.elements[elems[i].name]  = elems[i].url;
        }

        self.then(self);      
        mainScene.Loader.Pop(self);
      }
    }
    xhr.send();
  }else
    self.then(self);      
}

Assets.prototype.getURL = function(name){
  if(window.location.href =="https://dice-gl.glitch.me/")
    return this.elements[name];
  
return "Assets/"+name;
}