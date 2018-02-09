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
            AddIndex( line[0], indicesPos, indicesTex, indicesNor );
            AddIndex( line[1], indicesPos, indicesTex, indicesNor );
            AddIndex( line[2], indicesPos, indicesTex, indicesNor );
            counter++;
            /*
            if( line.lenght ==4) {
              AddIndex( line[3].split('/'), indicesPos, indicesTex, indicesNor );
              AddIndex( line[2].split('/'), indicesPos, indicesTex, indicesNor );
              AddIndex( line[1].split('/'), indicesPos, indicesTex, indicesNor );
              counter++;
            }
            */
            break;
        }
      }
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
      
const positionsAux = [    
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
  ];      
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
//      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsAux), gl.STATIC_DRAW);
      
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      
 const indices = [
  0,1,2,
  2,1,3,
  2,3,4,
  4,3,5,
  4,5,6,
  6,5,7,
  6,7,0,
  0,7,1,
  1,7,3,
  3,7,5,
  6,0,4,
  4,0,2,
  ];      
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesPos), gl.STATIC_DRAW);
//      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      counter=12;
      
      onLoad({ position: positionBuffer, indices: indexBuffer, faceCounter: counter });
    }        
  };
  xhr.send();
}

function AddIndex(indices, indicesPos, indicesTex, indicesNor ){
  var splited = indices.split(' ')[1].split('/');
  indicesPos.push(parseInt(splited[0])-1);
  indicesTex.push(parseInt(splited[1])-1);
  indicesNor.push(parseInt(splited[2])-1);
}