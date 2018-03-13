//var table;
var dice;
var gl;

var baseURL = "https://gunderwulde.github.io/dice-gl/";

function main() {
  const canvas =  document.getElementById("glcanvas");
//  canvas.width  = 720;//window.innerWidth;
//  canvas.height = 1280;//window.innerHeight;
  canvas.width  = window.innerHeight * 0.56;
  canvas.height = window.innerHeight;
  
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  
  var scene = new Scene();
  
  scene.results = new Results();
  scene.results.Load(baseURL+"Assets/dice.results");
  
  
  var shader = new Shader("Default.shader", function(shader){    

    scene.CreateMesh(shader).Load(baseURL+"Assets/Mesa.mesh", 
      function (mesh){
        var tex0 = new Texture();
        tex0.Load(baseURL+"Assets/felt.png");
        mesh.textures.push(tex0 );

        var tex1 = new Texture();
        tex1.Load(baseURL+"Assets/foam.jpg");
        mesh.textures.push( tex1 );
    });

    dice = scene.CreateMesh(shader).Load(baseURL+"Assets/SquaredDice.mesh", 
      function (mesh){
        var tex0 = new Texture();
        tex0.Load(baseURL+"Assets/DadoRojo.png");
        mesh.textures.push(tex0);
    });
    
    canvas.onclick = function(ev){
      scene.results.Throw(getRandomInt(1,6));
    };
    
  });
  
  scene.Update = function(deltaTime){
    scene.results.Update( deltaTime, dice, scene.camera);
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

