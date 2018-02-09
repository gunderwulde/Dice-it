function LoadObject(gl, url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.onload = function(e){
    if (this.status == 200) {
      var positions = [];
      var normals = [];
      var uvs = [];
      var indicesPos = [];
      var indicesNor = [];
      var indicesTex = [];
      var lines = this.response.split('\n');
      var counter = 0;
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(' ');
        
        switch(line[0]){
          case 'v':
            positions.push(parseFloat(line[1])); positions.push(parseFloat(line[2])); positions.push(parseFloat(line[3]));
            break;
          case 'vn':
            normals.push(parseFloat(line[1])); normals.push(parseFloat(line[2])); normals.push(parseFloat(line[3]));
            break;
          case 'vt':
            uvs.push(parseFloat(line[1])); uvs.push(parseFloat(line[2]));
            break;
          case 'f':
            console.log(">>>"+line.length);
            if( line.length ==5) {
              /*
              AddIndex( line[1], indicesPos, indicesTex, indicesNor );
              AddIndex( line[2], indicesPos, indicesTex, indicesNor );
              AddIndex( line[3], indicesPos, indicesTex, indicesNor );
              counter++;

              AddIndex( line[1], indicesPos, indicesTex, indicesNor );
              AddIndex( line[3], indicesPos, indicesTex, indicesNor );
              AddIndex( line[4], indicesPos, indicesTex, indicesNor );
              counter++;
              */
            }else if( line.length ==4) {
              console.log("3 vertices");
              AddIndex( line[1], indicesPos, indicesTex, indicesNor );
              AddIndex( line[3], indicesPos, indicesTex, indicesNor );
              AddIndex( line[2], indicesPos, indicesTex, indicesNor );
              counter++;
            }
            break;
        }
      }
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
   
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesPos), gl.STATIC_DRAW);
      counter=12;
      
      onLoad({ position: positionBuffer, indices: indexBuffer, faceCounter: counter });
    }        
  };
  xhr.send();
}

function AddIndex(indices, indicesPos, indicesTex, indicesNor ){
  var splited = indices.split('/');
  indicesPos.push(parseInt(splited[0])-1);
  indicesTex.push(parseInt(splited[1])-1);
  indicesNor.push(parseInt(splited[2])-1);
}