var mesh;
var shader;
var texture;
var camera;

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
  
  camera = new Camera();
  camera.Position(10, -8.5, -10)
  camera.Rotation(48, 0, 0);
  
  mesh = new Mesh();
  shader = new Shader();
  shader.Init(gl);
  
  gl.useProgram(shader.programInfo.program);
  const projectionMatrix = new Matrix4();
  projectionMatrix.perspective( 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
  gl.uniformMatrix4fv( shader.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.elements);    
  
  mesh.LoadMesh( gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FMesa.mesh?1520512249105", 
    function (){
      var then = 0;
    
      texture = new Texture();
      texture.Load(gl,"https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffelt.bmp?1520513317857" );
    
      function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        drawScene(gl, shader.programInfo, deltaTime);
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
function drawScene(gl, programInfo, deltaTime) {
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
  
  
  
  // la view matrix es la inversa de la camara... se supone
  
 var modelViewMatrix = new Matrix4();
  modelViewMatrix.multiply(camera.Matrix() ,modelMatrix);
  gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.elements);
  
  mesh.Draw(gl, programInfo, texture);
}



function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}