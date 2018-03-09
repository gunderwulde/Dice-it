var mainScene;

function Scene() {
  mainScene = this;
  this.name = "Scene";
  this.Entities = [];  
  this.Loader = new Loader(this, this.OnReady);
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
  for( var i=0;i<this.Entities.length;++i){
    this.Entities[i].Draw();
  }
}

Scene.prototype.OnReady = function(scene){
  var then = 0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;    
    scene.Draw();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
