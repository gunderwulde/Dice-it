function Mesh() {
}

Mesh.prototype.LoadMesh = function(gl, url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      var positions = [];
      var normals = [];
      var uvs = [];
      var indices : []; 
      var idx = 0;
      var vertices = view.getUint16(idx,true); idx+=2;
      for (var i = 0; i < vertices; i++) {
        target.positions.push( view.getFloat32(idx,true) ); idx+=4;
        target.positions.push( view.getFloat32(idx,true) ); idx+=4;
        target.positions.push( view.getFloat32(idx,true) ); idx+=4;
      }
      for (var i = 0; i < vertices; i++) {
        target.normals.push( view.getFloat32(idx,true) ); idx+=4;
        target.normals.push( view.getFloat32(idx,true) ); idx+=4;
        target.normals.push( view.getFloat32(idx,true) ); idx+=4;
      }
      for (var i = 0; i < vertices; i++) {
        target.uvs.push( view.getFloat32(idx,true) ); idx+=4;
        target.uvs.push( view.getFloat32(idx,true) ); idx+=4;
        
      }
      var indexOffset = 0;
      var subMeshCount = view.getUint16(idx,true); idx+=2;
      for (var j = 0; j < subMeshCount; j++) {
        var indexCount = view.getUint16(idx,true); idx+=2;
        this.submeshes.push( { offset:indexOffset, count: indexCount } );
        for (var i = 0; i < indexCount; i++) {
          target.indices.push( view.getUint16(idx,true) ); idx+=2;
        }
        indexOffset += indexCount;
      }
      
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target.positions), gl.STATIC_DRAW);
      
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target.normals), gl.STATIC_DRAW);

      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target.uvs), gl.STATIC_DRAW );
      
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(target.indices), gl.STATIC_DRAW);
      
      onLoad();
    }        
  };
  xhr.send();
}

Mesh.prototype.Draw = function(){
  
}
