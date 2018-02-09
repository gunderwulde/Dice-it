function LoadObject(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.onload = function(e){
    if (this.status == 200) {
      var position = [];
      var normals = [];
      var uvs = [];
      var indicesPos = [];
      var indicesNor = [];
      var indicesTex = [];
      var lines = this.response.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(' ');
        
        switch(line[0]){
          case 'v':
            position.push(parseFloat(line[1]));
            position.push(parseFloat(line[2]));
            position.push(parseFloat(line[3]));
            break;
          case 'vt':
            uvs.push(parseFloat(line[1]));
            uvs.push(parseFloat(line[2]));
            break;
          case 'vn':
            normals.push(parseFloat(line[1]));
            normals.push(parseFloat(line[2]));
            normals.push(parseFloat(line[3]));
            break;
          case 'f':
            for (var j = 0; j < 3; j++) {
              var idx = line[j].split('/');
              indicesPos.push(parseInt(idx[0]));
              indicesNor.push(parseInt(idx[1]));
              indicesTex.push(parseInt(idx[2]));
            }
            break;
        }
      }
            console.log(">>>  "+position[0]);  
      console.log(">>> positions " + position.lenght );
    }        
  };
  xhr.send();
}