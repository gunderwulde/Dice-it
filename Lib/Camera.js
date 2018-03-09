var currentCamera;

function Camera() {
  this.viewMatrix = new Matrix4();
  this.dirty = true;
  currentCamera = this;
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
