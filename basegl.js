function main() {
  const canvas = document.querySelector('#glcanvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;  
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

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
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    uniform sampler2D uSampler;
    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  LoadObject(gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FDice%20Lowpoly.obj?1518164652195", 
    function (buffers){
      var then = 0;
      // Draw the scene repeatedly
      const texture = LoadTexture(gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FDice%20Texture%20Color.jpg?1518164631735");
      function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        drawScene(gl, programInfo, buffers, texture, deltaTime);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
  });
  
  
}

var currentIndex = 0;
var first = true;
var time = 0;
//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
  gl.clearColor(0.75, 0.75, 0.75, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var modelMatrix = new Matrix4();
	modelMatrix.rotationEuler( rotations[currentIndex+0] * 0.0174532924, rotations[currentIndex+1] * 0.0174532924, rotations[currentIndex+2] * 0.0174532924);
  modelMatrix.position( positions[currentIndex+0], positions[currentIndex+1], positions[currentIndex+2]);
  
  time+=deltaTime;
  if(time>0.03){
    time-=0.03;
  if(currentIndex>=positions.length){
    currentIndex=0;
  }else{
    currentIndex+=3;
  }  
  }
  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  const normalMatrix = new Matrix4();
  normalMatrix.invert(modelMatrix);
  normalMatrix.transpose();
  
  if(first){
    first=false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer( programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( programInfo.attribLocations.vertexPosition); 

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer( programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( programInfo.attribLocations.textureCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer( programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( programInfo.attribLocations.vertexNormal);

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    const projectionMatrix = new Matrix4();
    projectionMatrix.perspective(-45 * Math.PI / 180, -gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    
    // Set the shader uniforms
    gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.elements);
  
  }
 var viewMatrix = new Matrix4();
	viewMatrix.rotationEuler(90 * 0.0174532924, 0.0174532924, 0 * 0.0174532924);
  viewMatrix.position( 0,0,-15);
  
 var modelViewMatrix = new Matrix4();
  modelViewMatrix.multiply(viewMatrix,modelMatrix);
  gl.drawElements(gl.TRIANGLES, buffers.faceCounter, gl.UNSIGNED_SHORT, 0);

  gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.elements);
  gl.uniformMatrix4fv( programInfo.uniformLocations.normalMatrix, false, normalMatrix.elements);

}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = LoadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = LoadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function LoadShader(gl, type, source) {
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

function LoadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]) );
  const image = new Image();
  image.setAttribute('crossorigin', 'anonymous');
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
return texture;
}


function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}