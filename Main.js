//var table;
var dice;
var gl;

function main() {
  const canvas =  document.getElementById("glcanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
//  canvas.width  = window.innerHeight * 0.56;
//  canvas.height = window.innerHeight;
  
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true}) || canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
  if (!gl) return;
  
  var scene = new Scene();
  new Assets().then = function(assets){    
    scene.results = new Results();
    scene.results.Load( assets.getURL("dice.results"), true );

    var normalShader = new Shader("Normal.shader",true);
    normalShader.then = function(shader){
        dice = scene.CreateMesh(normalShader).Load(assets.getURL("DadoAzulRedondeado.mesh"), 
            function (mesh){
            var tex0 = new Texture();
            tex0.Load(assets.getURL("DadoBlanco05.png"));
            mesh.textures.push(tex0);
            mesh.normal  = new Texture();
            mesh.normal.Load(assets.getURL("NormalDados.png"));

        });

        canvas.onclick = function(ev){
            scene.results.Throw(getRandomInt(1,6));
        };
    };
    scene.Update = function(deltaTime){
      scene.results.Update( deltaTime, dice, scene.camera);
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

