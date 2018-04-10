function Camera() {
  this.name = "Camera";
  this.viewProjectionMatrix = new Matrix4();
  this.viewMatrix = new Matrix4();
  this.Position(new Vector3());
  this.Rotation(new Quaternion());
  
  gl.clearColor(0, 0, 0, 0);
  gl.clearDepth(1.0);
  
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  this.projectionMatrix = new Matrix4();
  this.projectionMatrix.perspective( 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 20.0);  
}

Camera.prototype.Position = function (p) { this.position=p; this.dirty = true;}
Camera.prototype.Rotation = function (q) { this.rotation=q; this.dirty = true;}

Camera.prototype.Update = function(){
  if(this.dirty){
    var rotationMatrix = this.rotation.ToMatrix();
//    var rotationMatrix = new Matrix4();
    //rotationMatrix.fromQuaternion(this.rotation);
    var positionMatrix = new Matrix4();

    positionMatrix.position( this.position.Neg() );
    this.viewMatrix.multiply(rotationMatrix, positionMatrix );

    this.viewProjectionMatrix.multiply(this.projectionMatrix, this.viewMatrix );
    this.dirty=false;
  }
}

