function Results() {
  this.name="Anim";
  this.current = null;
}

Results.prototype.Load = function(url, nocache, onLoad ){
  var xhr = new XMLHttpRequest();
  if(nocache!=null) url+='?_=' + new Date().getTime();
  xhr.open('GET', url, true);
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

Results.prototype.Update = function(deltaTime, dice, camera ){
  if(this.current!=null){
    if( !this.current.Update(deltaTime, dice, camera) ){      
      this.current=null;
    }
  }
}

Results.prototype.getRandomInt = function(min, max) {
    return Math.floor( Math.random() * (max - min + 1)) + min;
}

Results.prototype.Throw = function(value){
  var rand = this.getRandomInt(0,4);
  this.current = this.valores[value-1].result[rand];
  this.current.Reset();
}

function Value() {
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
    this.scaleTime = [];
    this.dicePosition =[];
    this.diceRotation =[];
    this.cameraPosition =[];
    this.cameraRotation =[];
    for(var i=0;i<this.frames;i++){ 
      this.scaleTime.push(view.getFloat32(idx,true)); // <-- se leera del fichero
      idx+=4;
    }
    for(var i=0;i<this.frames;i++){ 
        this.dicePosition.push( new Vector3( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true) ) );
        idx+=12;
    }
    for(var i=0;i<this.frames;i++){ 
      this.diceRotation.push(new Quaternion( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true), view.getFloat32(idx+12,true) ) );
      idx+=16;
    }
    for(var i=0;i<this.frames;i++){ 
      this.cameraPosition.push( new Vector3( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true) ) );
      idx+=12;
    }
    for(var i=0;i<this.frames;i++){ 
      this.cameraRotation.push(new Quaternion( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true), view.getFloat32(idx+12,true) ) );
      idx+=16;
    }
  return idx;
}

Result.prototype.Update = function(deltaTime, dice, camera){
    this.time += deltaTime*this.scaleTime[this.currentIndex];
    if(this.time > 0.03) {
      this.time=0.00;      
      if(this.currentIndex>=this.frames-2) {
        return false;
      }
      else
        this.currentIndex++;
    }
    var t =  this.time/0.03;
    camera.Position( Vector3.Lerp(this.cameraPosition[this.currentIndex],this.cameraPosition[this.currentIndex+1], t ) );
    camera.Rotation(Quaternion.Lerp(  this.cameraRotation[this.currentIndex],this.cameraRotation[this.currentIndex+1],t));
    
    dice.Position( Vector3.Lerp(this.dicePosition[this.currentIndex],this.dicePosition[this.currentIndex+1], t ) );
    dice.Rotation( Quaternion.Lerp(this.diceRotation[this.currentIndex],this.diceRotation[this.currentIndex+1],t));
return true;
}
