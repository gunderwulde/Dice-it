function Scene() {
  this.name = "Scene";
  this.Entities = [];
  this.Loader = new Loader(this.OnReady);  
}

Scene.prototype.Push = function (entity) {
  this.Entities.push(entity);
  return entity;
}

Scene.prototype.CreateMesh = function(){
  var mesh = new Mesh();
  this.Entities.push(mesh);
  return mesh;
}

Scene.prototype.Draw = function() {  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  console.log("Draw "+this.Name);
  for( var i=0;i<this.Entities.length;++i){
    this.Entities[i].Draw();
  }
}

Scene.prototype.OnReady = function(){  
  
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
