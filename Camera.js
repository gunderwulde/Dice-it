function Camera() {
  this.viewMatrix = new Matrix4();
	this.viewMatrix.rotationEuler(90 * 0.0174532924, 0 * 0.0174532924, 0 * 0.0174532924);
  this.viewMatrix.position( 0,0,-15);
  this.dirty = true;
}

Camera.prototype.Position = function (x,y,z) { this.px=x; this.py=y; this.pz=z; this.dirty = true;}
Camera.prototype.Rotation = function (x,y,z) { this.rx=x; this.ry=y; this.rz=z; this.dirty = true;}

Camera.prototype.Matrix = function(){
  if(this.dirty){
	  this.viewMatrix.rotationEuler(this.rx * 0.0174532924, this.ry * 0.0174532924, this.rz * 0.0174532924);
    this.viewMatrix.position( this.px,this.py,this.pz);
    
    this.viewMatrix.inverse()
    this.dirty=false;
  }
  return this.viewMatrix;
}
