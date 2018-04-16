//var table;
var dice;
var gl;
var scene;

function main() {
  const canvas =  document.getElementById("glcanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
//  canvas.width  = window.innerHeight * 0.56;
//  canvas.height = window.innerHeight;
  
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true}) || canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
  if (!gl) return;
  
  scene = new Scene();
  new Assets().then = function(assets){
    scene.results = new Results();
    scene.results.Load( assets.getURL("dice.results"), true );

    var normalShader = new Shader("Default.shader",true);
    normalShader.then = function(shader){
        dice = scene.CreateMesh(normalShader).Load(assets.getURL("DadoAzulRedondeado.mesh"), 
            function (mesh){
            var tex0 = new Texture();
            tex0.Load(assets.getURL("WhiteDice.png"));
            mesh.textures.push(tex0);
//            mesh.normal  = new Texture();
//            mesh.normal.Load(assets.getURL("NormalDados.png"));
//confetti = new Confetti(normalShader);
//scene.Push(confetti);

        });
/*
        canvas.onclick = function(ev){
            scene.results.Throw(getRandomInt(1,6));
        };
*/
    };
    scene.Update = function(deltaTime){

      if( !scene.results.Update( deltaTime, dice, scene.camera) )
      {
        //rolling=false;
        console.log("Finish!!!");
       
        document.getElementById("endRoll").style.display = 'block';
      }
    }
  }
}

function roll(){
  document.getElementById("roll").style.display = 'none';
  scene.results.Throw(getRandomInt(1,6), finish);
  rolling = true;
}

function finish(ret){

}

function showProgress(){
  document.getElementById("glcanvas").style.display = 'none';
  document.getElementById("roll").style.display = 'none';
  document.getElementById("progress").style.display = 'block';
}

function hideProgress(){
  document.getElementById("glcanvas").style.display = 'block';
  document.getElementById("roll").style.display = 'block';
  document.getElementById("progress").style.display = 'none';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

