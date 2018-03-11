

function Anim() {
  this.name="Anim";
  this.currentIndex = 0;
  this.time = 0;
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
      this.frames = view.getUint16(idx,true); idx+=2;
      this.dicePosition =[];
      this.diceRotation =[];
      this.cameraPosition =[];
      this.cameraRotation =[];
      for(var i=0;i<this.frames*3;i++){ this.dicePosition.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<this.frames*3;i++){ this.diceRotation.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<this.frames*3;i++){ this.cameraPosition.push(view.getFloat32(idx,true));idx+=4;}
      for(var i=0;i<this.frames*3;i++){ this.cameraRotation.push(view.getFloat32(idx,true));idx+=4;}
      if(onLoad!=undefined) onLoad(self);
      mainScene.Loader.Pop(self);
    }
  }
  xhr.send();
}

Anim.prototype.Upate = function(deltaTime, dice, camera ){
  dice.Position( this.dicePosition[this.currentIndex+0], this.dicePosition[currentIndex+1], this.dicePosition[currentIndex+2] );
  dice.this.Rotation( this.diceRotationthis.currentIndex+0], this.diceRotation[currentIndex+1], this.diceRotation [currntIndex+2] );
  
  this.time+=deltaTime;
  if(this.time>0.03){
    this.time-=0.03;
    if(this.currentIndex>=this.frames){
      this.currentIndex=0;
    }else{
      this.currentIndex+=3;
    }  
  }
}