function Scene() {
  this.Entities = [];
  this.Loader = new Loader(this.OnReady);
}

Scene.prototype.Push = function (entity) {
  this.Entities.push(entity);
  return entity;
}

Scene.prototype.Draw = function(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for( var i=0;i<this.Entities.length;++i){
    this.Entities[i].Draw();
  }
}

Scene.prototype.OnReady = function(){  
    var then = 0;
  var self = this;
    function render(now) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;
      console.log(">>> "+self);
      self.Draw();
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
