function LoadObject(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.onload = function(e){
    if (this.status == 200) {
      var position = [];
      var normals = [];
      var uvs = [];
      var indices = [];
      var lines = this.response.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(' ');
        switch(line[0]){
          case 'v':
            position.push(parseFloat(line[0]));
            position.push(parseFloat(line[1]));
            position.push(parseFloat(line[2]));
            break;
          case 'vt':
            uvs.push(parseFloat(line[0]));
            uvs.push(parseFloat(line[1]));
            uvs.push(parseFloat(line[2]));
            break;
          case 'vn':
            normals.push(parseFloat(line[0]));
            normals.push(parseFloat(line[1]));
            normals.push(parseFloat(line[2]));
            break;
          case 'f':
            var indices = 
            break;
        }
      }
    }        
  };
  xhr.send();
}