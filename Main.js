//var table;
var dice;
var gl;

function loadResource(name){
  if(window.location.href =="https://dice-gl.glitch.me/"){
    switch(name){
      case "dice.results": return "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Fdice.results?1520865831507";
      case "Mesa.mesh": return "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FMesa.mesh?1520512249105";
      case "SquaredDice.mesh": return "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FSquaredDice.mesh?1520581541807";      
      case "felt.png": return "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffelt.bmp?1520513317857";        
      case "foam.jpg": return "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2Ffoam.jpg?1520546066891";      
      case "DadoRojo.png": return "https://cdn.glitch.com/6b9bae08-1c15-4de1-b8de-0acf17c0e056%2FDadoRojo.png?1520581517809";
    }
  }
  else{
    return "https://gunderwulde.github.io/dice-gl/Assets/"+name;
  }
}



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
  scene.results.Load( loadResource("dice.results") );
    
  var shader = new Shader("Default.shader", function(shader){    
    scene.CreateMesh(shader).Load(loadResource("Mesa.mesh"), 
      function (mesh){
        var tex0 = new Texture();
        tex0.Load(loadResource("felt.png"));
        mesh.textures.push(tex0 );

        var tex1 = new Texture();
        tex1.Load(loadResource("foam.jpg"));
        mesh.textures.push( tex1 );
    });

    dice = scene.CreateMesh(shader).Load(loadResource("SquaredDice.mesh"), 
      function (mesh){
        var tex0 = new Texture();
        tex0.Load(loadResource("DadoRojo.png"));
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

