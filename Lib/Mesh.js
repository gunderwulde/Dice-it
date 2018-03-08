function Mesh() {
  this.submeshes = [];
  this.modelMatrix = new Matrix4();
  this.normalMatrix = new Matrix4();
  this.textures = [];
}

Mesh.prototype.Load = function(url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var self = this;
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
        uvs.push( view.getFloat32(idx,true) ); idx+=4;
        uvs.push( view.getFloat32(idx,true) ); idx+=4;
        
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
      onLoad();
    }        
  };
  xhr.send();
}

Mesh.prototype.Draw = function(shader){
  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  gl.vertexAttribPointer( shader.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( shader.attribLocations.vertexPosition); 

  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.vertexAttribPointer( shader.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray( shader.attribLocations.vertexNormal);
    
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
  gl.vertexAttribPointer( shader.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray( shader.attribLocations.textureCoord);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  
  shader.Use(gl);
  
  this.normalMatrix.invert(this.modelMatrix);
  this.normalMatrix.transpose();
  
  gl.uniformMatrix4fv( shader.uniformLocations.normalMatrix, false, this.normalMatrix.elements);
    
  for( var i=0;i<this.submeshes.length;++i){
    this.textures[i].Set(shader);
    gl.drawElements(gl.TRIANGLES, this.submeshes[i].count, gl.UNSIGNED_SHORT, this.submeshes[i].offset*2);
  }
}
