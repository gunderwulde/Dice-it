var mesh;
var shader;

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
  mesh = new Mesh();
  shader = new Shader();
  shader.Init(gl);
  
  mesh.LoadMesh( gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FMesa.mesh?1520512249105", 
    function (){
      var then = 0;
      // Draw the scene repeatedly
      //const texture = LoadTexture(gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FDice%20Texture%20Color.jpg?1518164631735");
      const texture = LoadTexture(gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffelt.bmp?1520513317857");
      function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        drawScene(gl, shader.programInfo, texture, deltaTime);
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
function drawScene(gl, programInfo, texture, deltaTime) {
  gl.clearColor(0.75, 0.75, 0.75, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var modelMatrix = new Matrix4();
  /*
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
  */
  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  const normalMatrix = new Matrix4();
  normalMatrix.invert(modelMatrix);
  normalMatrix.transpose();
  
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv( programInfo.uniformLocations.normalMatrix, false, normalMatrix.elements);
  
  if(first){
    first=false;
    gl.useProgram(programInfo.program);
    
    const projectionMatrix = new Matrix4();
    projectionMatrix.perspective(-45 * Math.PI / 180, -gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.elements);    
  }
  
  // la view matrix es la inversa de la camara... se supone
 var viewMatrix = new Matrix4();
	viewMatrix.rotationEuler(90 * 0.0174532924, 0 * 0.0174532924, 0 * 0.0174532924);
  viewMatrix.position( 0,0,-15);
  
 var modelViewMatrix = new Matrix4();
  modelViewMatrix.multiply(viewMatrix,modelMatrix);
  gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.elements);
  
  mesh.Draw(gl, programInfo, texture);
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