function Texture() {
  this.name = "Texture";
}

Texture.prototype.Load = function(url, onLoad){
  this.texture = gl.createTexture();
  
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]) );
  
  const image = new Image();
  image.setAttribute('crossorigin', 'anonymous');
  var self = this;
  mainScene.Loader.Push(self);
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, self.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    if (self.isPowerOf2(image.width) && self.isPowerOf2(image.height)) {
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    if(onLoad!=undefined) onLoad(self);
    mainScene.Loader.Pop(self);
  };
  image.src = url;
}

Texture.prototype.isPowerOf2 = function(value) {
  return (value & (value - 1)) == 0;
}
