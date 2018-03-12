var mainScene;

function Scene() {
  mainScene = this;
  this.camera = new Camera();
  this.name = "Scene";
  this.Entities = [];  
  this.Loader = new Loader(this, this.OnReady );
}

Scene.prototype.Push = function (entity) {
  this.Entities.push(entity);
  return entity;
}

Scene.prototype.CreateMesh = function(shader){
  return this.Push(new Mesh(shader));
}

Scene.prototype.Draw = function() {  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.camera.Update();
  for( var i=0;i<this.Entities.length;++i){
    this.Entities[i].Draw(this);
  }
}

Scene.prototype.OnReady = function(self){
  var then = 0;
  function render(now) {    
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    if(self.Update!=undefined) self.Update(deltaTime);
    self.Draw();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

