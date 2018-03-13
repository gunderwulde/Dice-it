function Assets(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', ".glitch-assets", true);
//  xhr.responseType = 'arraybuffer';
 
  var self = this;
  
  self.elements=[];

  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      
      var str = this.response.split("\n").join(",\n");
      var elems = JSON.parse('{"elems":[' + str + "{}]}").elems;
      for( var i=0;i<elems.length;++i)
        self.elements[elems[i].name]  = elems[i].url;
      mainScene.Loader.Pop(self);
    }
  }
  xhr.send();
}

Assets.prototype.getURL = function(name){
  return self.elements[name];
}