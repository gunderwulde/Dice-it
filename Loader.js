function LoadObject(gl, url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.onload = function(e){
    if (this.status == 200) {
      var origin = {
        positions : [],
        normals : [],
        uvs : []
      };
      var target = {
        positions : [],
        normals : [],
        uvs : []
      };
        
      var indicesPos = [];
      var lines = this.response.split('\n');
      var counter = 0;
      
      
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(' ');
        
        switch(line[0]){
          case 'v':
            origin.positions.push(parseFloat(line[1])); origin.positions.push(parseFloat(line[2])); origin.positions.push(parseFloat(line[3]));
            break;
          case 'vn':
            origin.normals.push(parseFloat(line[1])); origin.normals.push(parseFloat(line[2])); origin.normals.push(parseFloat(line[3]));
            break;
          case 'vt':
            origin.uvs.push(parseFloat(line[1])); origin.uvs.push(parseFloat(line[2]));
            break;
          case 'f':
            AddIndex( line[1], origin, target );
            AddIndex( line[2], origin, target );
            AddIndex( line[3], origin, target );
            indicesPos.Push(counter+0);
            indicesPos.Push(counter+1);
            indicesPos.Push(counter+2);
            if( line.length ==5) {
              AddIndex( line[1], origin, target );
              AddIndex( line[3], origin, target );
              AddIndex( line[4], origin, target );
              indicesPos.Push(counter+0);
              indicesPos.Push(counter+2);
              indicesPos.Push(counter+3);
              counter+=4;              
            }else
              counter+=3;
            break;
        }
      }
      
      
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW );
      
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesPos), gl.STATIC_DRAW);
      
      onLoad({ position: positionBuffer, normal: normalBuffer, textureCoord: textureCoordBuffer, indices: indexBuffer, faceCounter: counter });
    }        
  };
  xhr.send();
}

function AddIndex(indices, origin, target ){
  var splited = indices.split('/');
  var idVer  = parseInt(splited[0])-1;
  var idTex = parseInt(splited[1])-1;
  var idNor  = parseInt(splited[2])-1;
  target.positions.Push( origin.position[idVer*3+0] );
  target.positions.Push( origin.position[idVer*3+1] );
  target.positions.Push( origin.position[idVer*3+2] );
  target.uvs.Push( origin.uvs[idTex*2+0] );
  target.uvs.Push( origin.uvs[idTex*2+1] );
  target.normals.Push( origin.normals[idNor*3+0] );
  target.normals.Push( origin.normals[idNor*3+1] );
  target.normals.Push( origin.normals[idNor*3+2] );
}