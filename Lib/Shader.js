var currentShader;

function Shader(url, OnLoad ){
  this.name = "Shader";
  this.OnLoad = OnLoad;
  this.Load(url);
  
}

Shader.prototype.Load = function(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  var self = this;
  
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var vertexStar = this.response.indexOf("[vertex]");
      var faceStar = this.response.indexOf("[face]");
      var vsSource = this.response.substring(vertexStar+8,faceStar);
      var fsSource = this.response.substring(faceStar+6);
      self.Init(vsSource,fsSource);
      if (self.OnLoad!=undefined) self.OnLoad(self);
      mainScene.Loader.Pop(self);
    }
  }
  xhr.send();
}

Shader.prototype.Init = function(vsSource,fsSource){
  const vertexShader   = this.LoadShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = this.LoadShader(gl.FRAGMENT_SHADER, fsSource);
  
  this.shaderProgram = gl.createProgram();
  gl.attachShader(this.shaderProgram, vertexShader);
  gl.attachShader(this.shaderProgram, fragmentShader);
  gl.linkProgram(this.shaderProgram);

  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.shaderProgram));
    return null;
  }
  
  this.attribLocations = {
    vertexPosition:   gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
    vertexNormal:     gl.getAttribLocation(this.shaderProgram, 'aVertexNormal'),
    textureCoord:     gl.getAttribLocation(this.shaderProgram, 'aTextureCoord'),
  };
  this.uniformLocations = {
    projectionMatrix: gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix:  gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
    normalMatrix:     gl.getUniformLocation(this.shaderProgram, 'uNormalMatrix'),
    uSampler:         gl.getUniformLocation(this.shaderProgram, 'uSampler'),
  }
}

Shader.prototype.Use = function(){
  if(currentShader!=this){
    gl.useProgram(this.shaderProgram);
    currentShader=this;
  }
}

Shader.prototype.UseTexture= function(texture){
  if(texture!=undefined){
    this.Use();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);
    gl.uniform1i(this.uniformLocations.uSampler, 0);
  }
}

Shader.prototype.LoadShader = function(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

Shader.prototype.setProjectionMatrix = function(matrix){
  this.Use();
  gl.uniformMatrix4fv( this.uniformLocations.projectionMatrix, false, matrix.elements);
}

Shader.prototype.setModelViewMatrix = function(matrix){
  this.Use();
  gl.uniformMatrix4fv( this.uniformLocations.modelViewMatrix, false, matrix.elements);
}
