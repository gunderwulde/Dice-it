function Mesh(shader) {
  this.name = "Mesh";
  this.shader = shader;
  this.submeshes = [];
  this.modelMatrix = new Matrix4();
  this.normalMatrix = new Matrix4();
  this.modelViewMatrix = new Matrix4();
  this.modelViewProyectionMatrix = new Matrix4();
  this.textures = [];
  this.Position(0,0,0);
  this.Rotation(0,0,0);
}

Mesh.prototype.Load = function(url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var self = this;
  
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      var positions = [];
      var normals = [];
      var uvs = [];
      var indices = []; 
      var idx = 0;
      var vertices = view.getUint16(idx,true); idx+=2;
      for (var i = 0; i < vertices; i++) {
        positions.push( view.getFloat32(idx,true) ); idx+=4;
        positions.push( view.getFloat32(idx,true) ); idx+=4;
        positions.push( view.getFloat32(idx,true) ); idx+=4;
      }
      for (var i = 0; i < vertices; i++) {
        normals.push( view.getFloat32(idx,true) ); idx+=4;
        normals.push( view.getFloat32(idx,true) ); idx+=4;
        normals.push( view.getFloat32(idx,true) ); idx+=4;
      }
      for (var i = 0; i < vertices; i++) {
        var u = view.getFloat32(idx,true); idx+=4;
        var v = view.getFloat32(idx,true); idx+=4;
        uvs.push( u ); 
        uvs.push( v-0.06 ); //???? Magic number
        
      }
      var indexOffset = 0;
      var subMeshCount = view.getUint16(idx,true); idx+=2;
      
      for (var j = 0; j < subMeshCount; j++) {
        var indexCount = view.getUint16(idx,true); idx+=2;
        self.submeshes.push( { offset:indexOffset, count: indexCount } );
        for (var i = 0; i < indexCount; i++) {
          indices.push( view.getUint16(idx,true) ); idx+=2;
        }
        indexOffset += indexCount;
      }
      
      self.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      
      self.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

      self.textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.textureCoordBuffer);      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW );
      
      self.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);      
      
      onLoad(self);
      
      mainScene.Loader.Pop(self);
    }        
  };
  xhr.send();
  return this;
}

Mesh.prototype.Draw = function(scene){
  var shader = this.shader;
  shader.Use(gl);
  
  if(this.dirty) {
    this.modelMatrix.rotationEuler(this.rx, this.ry, this.rz);
    this.modelMatrix.position( this.px, this.py, this.pz);
    this.modelViewProyectionMatrix.multiply(scene.camera.viewProjectionMatrix,this.modelMatrix );
    this.normalMatrix.rotationEuler( this.rx, this.ry, this.rz);
    this.dirty=false;
  }  

  shader.setNormalMatrix(this.normalMatrix);
  shader.setModelViewProjectionMatrix(this.modelViewProyectionMatrix);
  
  shader.BindBuffers(this);
  for( var i=0;i<this.submeshes.length;++i){
    shader.UseTexture(this.textures[i]);
    gl.drawElements(gl.TRIANGLES, this.submeshes[i].count, gl.UNSIGNED_SHORT, this.submeshes[i].offset*2);
  }
}

Mesh.prototype.Position = function (x,y,z) { this.px=x; this.py=y; this.pz=z; this.dirty = true;}
Mesh.prototype.Rotation = function (x,y,z) { this.rx=x* Math.PI / 180; this.ry=y* Math.PI / 180; this.rz=z* Math.PI / 180; this.dirty = true;}
Mesh.prototype.Rotate   = function (x,y,z) { this.rx+=x* Math.PI / 180; this.ry+=y* Math.PI / 180; this.rz+=z* Math.PI / 180; this.dirty = true;}