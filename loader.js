function LoadObject(gl, url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.onload = function(e){
    if (this.status == 200) {
      var source = {positions : [], normals : [], uvs : [] };
      var target = {positions : [], normals : [], uvs : [] };
        
      var indicesPos = [];
      var lines = this.response.split('\n');
      var counter = 0;
      var index = 0;
      
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(' ');
        switch(line[0]){
          case 'v':
            source.positions.push(parseFloat(line[1])*0.1);
            source.positions.push(parseFloat(line[2])*0.1); 
            source.positions.push(parseFloat(line[3])*0.1);
            break;
          case 'vn':
            source.normals.push(parseFloat(line[1]));
            source.normals.push(parseFloat(line[2]));
            source.normals.push(parseFloat(line[3]));
            break;
          case 'vt':
            source.uvs.push(parseFloat(line[1]));
            source.uvs.push(parseFloat(line[2]));
            break;
          case 'f':
            AddIndex( line[1], source, target );
            AddIndex( line[2], source, target );
            AddIndex( line[3], source, target );
            indicesPos.push(index+0);
            indicesPos.push(index+1);
            indicesPos.push(index+2);
            counter+=3;
            if( line.length ==5) {
              AddIndex( line[4], source, target );
              indicesPos.push(index+0);
              indicesPos.push(index+2);
              indicesPos.push(index+3);
              counter+=3;
              index+=4;
            }else
              index+=3;
            break;
        }
      }
      
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target.positions), gl.STATIC_DRAW);
      
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target.normals), gl.STATIC_DRAW);

      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target.uvs), gl.STATIC_DRAW );
      
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesPos), gl.STATIC_DRAW);
      
      onLoad({ position: positionBuffer, normal: normalBuffer, textureCoord: textureCoordBuffer, indices: indexBuffer, faceCounter: counter });
    }        
  };
  xhr.send();
}

function AddIndex(indices, source, target ){
  var splited = indices.split('/');
  var idVer  = parseInt(splited[0])-1;
  var idTex  = parseInt(splited[1])-1;
  var idNor  = parseInt(splited[2])-1;
  
  target.positions.push( source.positions[idVer*3+0] );
  target.positions.push( source.positions[idVer*3+1] );
  target.positions.push( source.positions[idVer*3+2] );
  target.uvs.push( source.uvs[idTex*2+0] );
  target.uvs.push( source.uvs[idTex*2+1] );
  target.normals.push( source.normals[idNor*3+0] );
  target.normals.push( source.normals[idNor*3+1] );
  target.normals.push( source.normals[idNor*3+2] );
}