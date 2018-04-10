var currentShader;

function Shader(url, nocache, OnLoad ){
  this.name = "Shader";
  this.OnLoad = OnLoad;
  this.Load(url, nocache);
}

Shader.prototype.Load = function(url, nocache){
  this.name=url;
  var xhr = new XMLHttpRequest();
  if(nocache!=null) url+='?_=' + new Date().getTime();
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
      if (self.then!=undefined) self.then(self);
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
    vertexTangent:    gl.getAttribLocation(this.shaderProgram, 'aVertexTangent'),
    vertexColor:      gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
  };
  this.uniformLocations = {
    modelMatrix:                gl.getUniformLocation(this.shaderProgram, 'uModelMatrix'),
    modelViewProjectionMatrix:  gl.getUniformLocation(this.shaderProgram, 'uModelViewProjectionMatrix'),
    normalMatrix:               gl.getUniformLocation(this.shaderProgram, 'uNormalMatrix'),
    uSampler:                   gl.getUniformLocation(this.shaderProgram, 'uSampler'),
    uNormalSampler:             gl.getUniformLocation(this.shaderProgram, 'uNormalSampler'),
    alpha:                      gl.getUniformLocation(this.shaderProgram, 'Alpha'),
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

Shader.prototype.UseNormal= function(texture){
  if(texture!=undefined){
    this.Use();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);    
    gl.uniform1i(this.uniformLocations.uNormalSampler, 1);
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

Shader.prototype.setModelViewProjectionMatrix = function(matrix){
  this.Use();
  gl.uniformMatrix4fv( this.uniformLocations.modelViewProjectionMatrix, false, matrix.elements);
}
Shader.prototype.setModelMatrix = function(matrix){
  this.Use();
  if(this.uniformLocations.modelMatrix!=-1)gl.uniformMatrix4fv( this.uniformLocations.modelMatrix, false, matrix.elements);
}

Shader.prototype.setNormalMatrix = function(matrix){
  this.Use();
  gl.uniformMatrix4fv( this.uniformLocations.normalMatrix, false, matrix.elements);
}

Shader.prototype.BindBuffers = function(mesh){
  this.Use();
  if(this.attribLocations.vertexPosition!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.attribLocations.vertexPosition); 
  }

  if(this.attribLocations.vertexNormal!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.vertexNormal);
  }
    
  if(this.attribLocations.vertexTangent!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.tangentsBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexTangent, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.vertexTangent);
  }
    
  if(this.attribLocations.textureCoord!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureCoordBuffer);
    gl.vertexAttribPointer( this.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.textureCoord);
  }
  if(this.attribLocations.vertexColor!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.vertexColor);
  }
   
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
}

Shader.prototype.setAlpha = function(a){
  this.Use();
  gl.uniform1f(this.uniformLocations.alpha, a);
}

