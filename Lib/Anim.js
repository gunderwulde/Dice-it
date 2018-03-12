

function Anim() {
  this.name="Anim";
  this.currentIndex = 0;
  this.time = 0;
  this.play = true;
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
      var idx=0;
      self.results = view.getUint16(idx,true); idx+=2;
      self.frames = view.getUint16(idx,true); idx+=2;
      self.dicePosition =[];
      self.diceRotation =[];
      self.cameraPosition =[];
      self.cameraRotation =[];
      for(var i=0;i<self.frames*3;i++){ self.dicePosition.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<self.frames*3;i++){ self.diceRotation.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<self.frames*3;i++){ self.cameraPosition.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<self.frames*3;i++){ self.cameraRotation.push(view.getFloat32(idx,true));idx+=4;}
      
      if(onLoad!=undefined) onLoad(self);
      mainScene.Loader.Pop(self);
      console.log("Loaded");
    }
  }
  xhr.send();
}

Anim.prototype.Update = function(deltaTime, dice, camera ){
  if(this.play){
    var idx = this.currentIndex*3;
    dice.Position( this.dicePosition[idx+0], this.dicePosition[idx+1], this.dicePosition[idx+2] );
    dice.Rotation( this.diceRotation[idx+0], this.diceRotation[idx+1], this.diceRotation[idx+2] );

    camera.Position( this.cameraPosition[idx+0], this.cameraPosition[idx+1], this.cameraPosition[idx+2] );
    camera.Rotation( this.cameraRotation[idx+0], this.cameraRotation[idx+1], this.cameraRotation[idx+2] );
    this.time+=deltaTime;
    if(this.time > 0.03) {
      this.time=0.00;
      if(this.currentIndex>this.frames) this.play=false;
      else this.currentIndex++;
    }
  }
}