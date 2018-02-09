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
            AddIndex( line[0].split('/'), indicesPos, indicesTex, indicesNor );
            AddIndex( line[1].split('/'), indicesPos, indicesTex, indicesNor );
            AddIndex( line[2].split('/'), indicesPos, indicesTex, indicesNor );
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
    0, 0, 0,
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];      
      
//      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsAux), gl.STATIC_DRAW);
      
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      
 const indices = [
  1,2,3,
  3,2,4,
  3,4,5,
5,4,6,
5,6,7
7,2/3 6/3/3 8/1/3
s 4
f 7/1/4 8/2/4 1/3/4
f 1/3/4 8/2/4 2/4/4
s 5
f 2/1/5 8/2/5 4/3/5
f 4/3/5 8/2/5 6/4/5
s 6
f 7/1/6 1/2/6 5/3/6
f 5/3/6 1/2/6 3/4/6
  ];      
//      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesPos), gl.STATIC_DRAW);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      counter=12;
      
      onLoad({ position: positionBuffer, indices: indexBuffer, faceCounter: counter });
    }        
  };
  xhr.send();
}

function AddIndex(split, indicesPos, indicesTex, indicesNor ){
  indicesPos.push(parseInt(split[0])-1);
  indicesTex.push(parseInt(split[1])-1);
  indicesNor.push(parseInt(split[2])-1);
}