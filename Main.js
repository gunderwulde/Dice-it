//var table;
var dice;
var gl;

function main() {
  const canvas =  document.getElementById("glcanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  /*
  canvas.width  = window.innerHeight * 0.56;
  canvas.height = window.innerHeight;
  */
  
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  
  var scene = new Scene();
  
  scene.camera.Position(0, 4, -8)
  scene.camera.Rotation(40, 0, 0);
  var shader = new Shader("Default.shader", function(shader){    

    scene.CreateMesh(shader).Load("https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FMesa.mesh?1520512249105", 
      function (mesh){
        var tex0 = new Texture();
        tex0.Load("https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffelt.bmp?1520513317857");
        mesh.textures.push(tex0 );

        var tex1 = new Texture();
        tex1.Load("https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffoam.jpg?1520546066891");
        mesh.textures.push( tex1 );
    });

    dice = scene.CreateMesh(shader).Load("https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FSquaredDice.mesh?1520581541807", 
      function (mesh){
        var tex0 = new Texture();
        tex0.Load("https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FDadoRojo.png?1520581517809");
        mesh.textures.push(tex0);
    });
  });
  
  scene.Update = function(deltaTime){
    dice.Position(0, 3.5, -7.5);
  }
  
  
}

/*
var currentIndex = 0;
var time = 0;

function drawScene(programInfo, deltaTime) {
  scene.Draw(shader);

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

}
*/