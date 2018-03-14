function Assets(){
  this.onGlitch = window.location.href.indexOf("glitch.me") !== -1;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', ".glitch-assets", true);
  var self = this;  
  self.elements=[];
  if (typeof mainScene !== 'undefined') mainScene.Loader.Push(self);  
  
  xhr.onload = function(e){
    if (this.status == 200) {
      var str = this.response.split("\n").join(",\n");
      var elems = JSON.parse('{"elems":[' + str + "{}]}").elems;
      for( var i=0;i<elems.length;++i){
        if(("date" in elems[i])){
          if(self.elements[elems[i].name]!=null){
            if(elems[i].date > self.elements[elems[i].name].date){
               self.elements[elems[i].name]  = elems[i];
            }
          }
          else
            self.elements[elems[i].name]  = elems[i];
          self.elements[elems[i].name].url = self.elements[elems[i].name].url+"?"+Date.parse(self.elements[elems[i].name].date);
        }
      }
    }
    Assets.instance = self;    
    if("then" in self) self.then(self);
    if (typeof mainScene !== 'undefined') mainScene.Loader.Pop(self);
  }
  xhr.send();
}

Assets.prototype.getURL = function(name){
  if(this.onGlitch)
    return this.elements[name].url;  
return "Assets/"+name;
}