var currentShadere;
function Shader(gl){
  this.gl=gl;
}

Shader.prototype.Init = function(){
// Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      // Apply lighting effect
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(-0.85, 0.8, 0.75));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  const fsSource = `
    uniform sampler2D uSampler;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;    
    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  var gl=this.gl;
  
  const vertexShader   = this.LoadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = this.LoadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
  this.shaderProgram = gl.createProgram();
  gl.attachShader(this.shaderProgram, vertexShader);
  gl.attachShader(this.shaderProgram, fragmentShader);
  gl.linkProgram(this.shaderProgram);

  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.shaderProgram));
    return null;
  }
  
  this.attribLocations = {
    vertexPosition:   this.GetAttribLocation('aVertexPosition'),
    vertexNormal:     this.GetAttribLocation('aVertexNormal'),
    textureCoord:     this.GetAttribLocation('aTextureCoord'),
  };
  this.uniformLocations = {
    projectionMatrix: this.GetUniformLocation('uProjectionMatrix'),
    modelViewMatrix:  this.GetUniformLocation('uModelViewMatrix'),
    normalMatrix:     this.GetUniformLocation('uNormalMatrix'),
    uSampler:         this.GetUniformLocation('uSampler'),
  }
}

Shader.prototype.GetAttribLocation = function(name){
  return this.gl.getAttribLocation(this.shaderProgram, name);
}

Shader.prototype.GetUniformLocation = function(name){
  return this.gl.getUniformLocation(this.shaderProgram, name);
}

Shader.prototype.Use = function(){
  if(currentShadere!=this){
    this.gl.useProgram(this.shaderProgram);
    currentShadere=this;
  }
}

Shader.prototype.LoadShader = function(gl, type, source) {
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

Shader.prototype.setProjectionMatrix = function(gl, matrix){
  this.Use();
  this.gl.uniformMatrix4fv( this.uniformLocations.projectionMatrix, false, matrix.elements);
}

Shader.prototype.setModelViewMatrix = function(gl, matrix){
  this.Use();
  this.gl.uniformMatrix4fv( this.uniformLocations.modelViewMatrix, false, matrix.elements);
}
