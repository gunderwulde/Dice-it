function Assets(){
}

Assets.prototype.Load = function(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "", true);
  xhr.responseType = 'arraybuffer';
 
  var self = this;

  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      var idx=0;
      self.valores = [];
      for(var j=0;j<6;j++){
        var value = { count:view.getUint16(idx,true), result: [] };
        idx+=2;        
        self.valores.push(value);
        for(var i=0;i<self.valores[j].count;i++){
          self.valores[j].result[i] = new Result();
          idx = self.valores[j].result[i].Load(view,idx);
        }
      }

      if(onLoad!=undefined) onLoad(self);
      mainScene.Loader.Pop(self);
    }
  }
  xhr.onerror = function(e) {
      console.error(xhr.statusText);
  };    
  xhr.send(null);
}