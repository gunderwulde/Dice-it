

function Anim() {
  this.name="Anim";
}

Anim.prototype.Load = function(url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var self = this;
  
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      this.frames = view.getUint16(idx,true); idx+=2;
      this.dicePosition =[];
      this.diceRotation =[];
      this.cameraPosition =[];
      this.cameraRotation =[];
      for(var i=0;i<this.frames*3;i++){ this.dicePosition.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<this.frames*3;i++){ this.diceRotation.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<this.frames*3;i++){ this.cameraPosition.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<this.frames*3;i++){ this.cameraRotation.push(view.getFloat32(idx,true));idx+=4;}
      console.log("!!!");
      if(onLoad!=undefined) onLoad(self);
      mainScene.Loader.Pop(self);
    }
  }
}