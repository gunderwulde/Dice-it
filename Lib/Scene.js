function Scene() {
  this.entities = [];
}

Scene.prototype.Push = function (entity) {
  this.entities.push(entity);
  return entity;
}

Scene.prototype.Draw = function(shader){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for( var i=0;i<this.entities.length;++i){
    this.entities[i].Draw(shader);
  }
}
