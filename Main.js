//var table;
var dice;
var gl;

function main() {
  const canvas =  document.getElementById("glcanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
//  canvas.width  = window.innerHeight * 0.56;
//  canvas.height = window.innerHeight;
  
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  
  var scene = new Scene();
  new Assets().then = function(assets){    
    scene.results = new Results();
    scene.results.Load( assets.getURL("dice.results") );

    var normalShader = new Shader("LightMapped.shader");
    normalShader.then = function(shader){      
        dice = scene.CreateMesh(normalShader).Load(assets.getURL("Cube.mesh"), 
          function (mesh){
            var tex0 = new Texture();
            tex0.Load(assets.getURL("CHECKER_512.png"));
            mesh.textures.push(tex0);
          
            mesh.lightmap = new Texture();
            mesh.lightmap.Load(assets.getURL("lightmap.png"));
        });
      
      dice.Position( 0,0,10);
/*      
      var lightMappedShader = new Shader("LightMapped.shader");
      lightMappedShader.then = function(shader) {
        scene.CreateMesh(lightMappedShader).Load(assets.getURL("MesaNew.mesh"), 
          function (mesh){
            var tex0 = new Texture();
            tex0.Load(assets.getURL("felt.png"));
            mesh.textures.push(tex0 );

            var tex1 = new Texture();
            tex1.Load(assets.getURL("foam.jpg"));
            mesh.textures.push( tex1 );
          
            mesh.lightmap  = new Texture();
            mesh.lightmap.Load(assets.getURL("Lightmap-0_comp_light.png"));
            
          
        });

        dice = scene.CreateMesh(normalShader).Load(assets.getURL("DadoRojoEsquinas.mesh"), 
          function (mesh){
            var tex0 = new Texture();
            tex0.Load(assets.getURL("DadoRojo.png"));
            mesh.textures.push(tex0);
        });

        canvas.onclick = function(ev){
          scene.results.Throw(getRandomInt(1,6));
        };
      };
*/
    };

    scene.Update = function(deltaTime){
      scene.results.Update( deltaTime, dice, scene.camera);
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

