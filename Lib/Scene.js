function Scene() {
  this.Entities = [];
  this.Loader = new Loader();
}

Scene.prototype.Push = function (entity) {
  this.Entities.push(entity);
  return entity;
}

Scene.prototype.Draw = function(shader){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for( var i=0;i<this.Entities.length;++i){
    this.Entities[i].Draw(shader);
  }
}
