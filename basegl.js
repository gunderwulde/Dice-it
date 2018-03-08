var mesh;
var shader;
var camera;

function main() {
  const canvas =  document.getElementById("glcanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  
  gl.clearColor(0.75, 0.75, 0.75, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  camera = new Camera();
  camera.Position(0, 8.5, -10)
  camera.Rotation(48, 0, 0);
  
  mesh = new Mesh();
  shader = new Shader();
  shader.Init(gl);
  
//  gl.useProgram(shader.programInfo.program);
  const projectionMatrix = new Matrix4();
  projectionMatrix.perspective( 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);  
  shader.setProjectionMatrix(gl, projectionMatrix);
  
  mesh.LoadMesh( gl, "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FMesa.mesh?1520512249105", 
    function (){
      var then = 0;    
      mesh.texture.Load(gl,"https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffelt.bmp?1520513317857" );
    
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

function drawScene(gl, programInfo, deltaTime) {
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
 var modelViewMatrix = new Matrix4();
  modelViewMatrix.multiply(camera.Matrix() ,modelMatrix);
  shader.setModelViewMatrix(gl, modelViewMatrix);
  mesh.Draw(gl, shader);
}