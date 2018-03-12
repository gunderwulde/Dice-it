//var table;
var dice;
var gl;

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
  scene.results.Load("https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Fdice.results?1520865831507");
  
  
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

