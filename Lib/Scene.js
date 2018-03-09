function Scene() {
  this.entities = [];
}

Scene.prototype.Push = function (entity) {
  this.entities.push(entity);
  return entity;
}

Scene.prototype.Draw = function(){
}
