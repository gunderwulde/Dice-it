var currentCamera;

function Camera() {
  this.name = "Camera";
  this.viewMatrix = new Matrix4();
  this.dirty = true;
  currentCamera = this;
  
  gl.clearColor(0.75, 0.75, 0.75, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  this.projectionMatrix = new Matrix4();
  this.projectionMatrix.perspective( 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);  
}

Camera.prototype.Position = function (x,y,z) { this.px=x; this.py=y; this.pz=z; this.dirty = true;}
Camera.prototype.Rotation = function (x,y,z) { this.rx=x; this.ry=y; this.rz=z; this.dirty = true;}

Camera.prototype.Matrix = function(){
  if(this.dirty){
    var rotationMatrix = new Matrix4();
	  rotationMatrix.rotationEuler(this.rx * 0.0174532924, this.ry * 0.0174532924, this.rz * 0.0174532924);
    var positionMatrix = new Matrix4();
    positionMatrix.position( this.px, -this.py, this.pz);
    this.viewMatrix.multiply(rotationMatrix, positionMatrix );
    this.dirty=false;
  }
  return this.viewMatrix;
}