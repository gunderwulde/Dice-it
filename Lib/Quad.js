function Quad() {
    this.blurShader = new Shader("Blur.shader",true);
    var vertices = [
        -1,1,0,
        -1,-1,0,
        1,-1,0,
        1,1,0 
      ];

    var bot = new Color(1, 0.26, 0.26,1); 
    var top = new Color(0.87, 0, 0, 1); 
    var colors = [];
    
    bot.ToArray(colors);
    top.ToArray(colors);
    top.ToArray(colors);
    bot.ToArray(colors);
     
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var indices = [3,2,1,1,3,0];
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

Quad.prototype.Draw = function (val) {
    this.blurShader.Use(gl);
    this.blurShader.setAlpha(0.15);
    this.blurShader.BindBuffers(this);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
  }