function Camera() {
  this.name = "Camera";
  this.viewProjectionMatrix = new Matrix4();
  this.viewMatrix = new Matrix4();
  this.Position(0,0,0);
  this.Rotation(new Quaternion());
  
  gl.clearColor(0.75, 0.75, 0.75, 1.0);
  gl.clearDepth(1.0);
  
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  this.projectionMatrix = new Matrix4();
  this.projectionMatrix.perspective( 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 20.0);  
}

Camera.prototype.Position = function (x,y,z) { this.px=x; this.py=y; this.pz=z; this.dirty = true;}
Camera.prototype.Rotation = function (q) { this.rotation=q; this.dirty = true;}

Camera.prototype.Update = function(){
  if(this.dirty){
    var rotationMatrix = this.rotation.ToMatrix();
    var positionMatrix = new Matrix4();
    positionMatrix.position( -this.px, -this.py, -this.pz);
    this.viewMatrix.multiply(rotationMatrix, positionMatrix );

    this.viewProjectionMatrix.multiply(this.projectionMatrix, this.viewMatrix );
    this.dirty=false;
  }
}

