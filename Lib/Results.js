function Results() {
  this.name="Anim";
  this.current = null;
}

Results.prototype.Load = function(url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var self = this;
  
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      var idx=0;
      self.count = view.getUint16(idx,true); idx+=2;
      self.result = [];
      for(var i=0;i<self.count;i++){
        self.result[i] = new Result();
        idx = self.result[i].Load(view,idx);
      }
      
      if(onLoad!=undefined) onLoad(self);
      mainScene.Loader.Pop(self);
    }
  }
  xhr.send();
}

Results.prototype.Update = function(deltaTime, dice, camera ){
  if(this.current!=null)
    if( !this.current.Update(deltaTime, dice, camera) )
      this.current=null;
}

Results.prototype.Throw = function(value){
  this.current = this.result[0];
}


function Result() {
  this.currentIndex = 0;
  this.time = 0;
}

Result.prototype.Reset = function(){
  this.currentIndex = 0;
  this.time = 0;
}

Result.prototype.Load = function(view,idx){
    this.frames = view.getUint16(idx,true); idx+=2;

    this.dicePosition =[];
    this.diceRotation =[];
    this.cameraPosition =[];
    this.cameraRotation =[];      
    for(var i=0;i<self.frames*3;i++){ self.dicePosition.push(view.getFloat32(idx,true));idx+=4;}
    for(var i=0;i<self.frames*3;i++){ self.diceRotation.push(view.getFloat32(idx,true));idx+=4;}
    for(var i=0;i<self.frames*3;i++){ self.cameraPosition.push(view.getFloat32(idx,true));idx+=4;}
    for(var i=0;i<self.frames*3;i++){ self.cameraRotation.push(view.getFloat32(idx,true));idx+=4;}
  
  return idx;
}

Result.prototype.Update = function(deltaTime, dice, camera){
    this.time+=deltaTime;
    if(this.time > 0.03) {
      this.time=0.00;      
      if(this.currentIndex>=this.frames-1) {
        return false;
      }
      else
        this.currentIndex++;
      
      var idx = this.currentIndex*3;
      camera.Position( this.cameraPosition[idx+0], this.cameraPosition[idx+1], this.cameraPosition[idx+2] );
      camera.Rotation( this.cameraRotation[idx+0], this.cameraRotation[idx+1], this.cameraRotation[idx+2] );      
      dice.Position( this.dicePosition[idx+0], this.dicePosition[idx+1], this.dicePosition[idx+2] );
      dice.Rotation( this.diceRotation[idx+0], this.diceRotation[idx+1], this.diceRotation[idx+2] );
    }
  return true;
}
