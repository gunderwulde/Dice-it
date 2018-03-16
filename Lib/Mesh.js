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
  this.Rotation(new Quaternion());
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
      var uvs2 = [];
      var indices = []; 
      var idx = 0;
      var uvCount = view.getUint16(idx,true); idx+=2;
      
      var vertices = view.getUint16(idx,true); idx+=2;
      for (var i = 0; i < vertices; i++) {
        positions.push( view.getFloat32(idx,true) ); idx+=4;
        positions.push( view.getFloat32(idx,true) ); idx+=4;
        positions.push( view.getFloat32(idx,true) ); idx+=4;
      }
      self.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      for (var i = 0; i < vertices; i++) {
        normals.push( view.getFloat32(idx,true) ); idx+=4;
        normals.push( view.getFloat32(idx,true) ); idx+=4;
        normals.push( view.getFloat32(idx,true) ); idx+=4;
      }
      self.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      
      for (var i = 0; i < vertices; i++) {
        var u = view.getFloat32(idx,true); idx+=4;
        var v = view.getFloat32(idx,true); idx+=4;
        uvs.push( u); 
        uvs.push(-v);
      }
      self.textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.textureCoordBuffer);      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW );
      
      if(uvCount==2){
        for (var i = 0; i < vertices; i++) {
          var u = view.getFloat32(idx,true); idx+=4;
          var v = view.getFloat32(idx,true); idx+=4;
          uvs2.push( u); 
          uvs2.push(-v);
        }
        self.textureCoord2Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, self.textureCoord2Buffer);      
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs2), gl.STATIC_DRAW );
      }else
        self.textureCoord2Buffer = null;
      
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
    
    var rotationMatrix = new Matrix4();
    rotationMatrix.fromQuaternion(this.rotation);
    var positionMatrix = new Matrix4();
    positionMatrix.position( this.px, this.py, this.pz);
    this.modelMatrix.multiply(positionMatrix,rotationMatrix );
    this.normalMatrix.fromQuaternion(this.rotation);
    this.dirty=false;
  }  
    this.modelViewProyectionMatrix.multiply(scene.camera.viewProjectionMatrix,this.modelMatrix );

  shader.setNormalMatrix(this.normalMatrix);
  shader.setModelViewProjectionMatrix(this.modelViewProyectionMatrix);
  
  shader.BindBuffers(this);
  if(this.lightmap) shader.UseLightmap(this.lightmap,[0.6195877,0.6195877,-0.002420264,0.002420264]);
  for( var i=0;i<this.submeshes.length;++i){ 
    shader.UseTexture(this.textures[i],0);
    gl.drawElements(gl.TRIANGLES, this.submeshes[i].count, gl.UNSIGNED_SHORT, this.submeshes[i].offset*2);
  }
}

Mesh.prototype.Position = function (x,y,z) { this.px=x; this.py=y; this.pz=z; this.dirty = true;}
Mesh.prototype.Rotation = function (q) { this.rotation=q; this.dirty = true;}
