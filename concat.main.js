function Assets(){
  this.onGlitch = window.location.href.indexOf("glitch.me") !== -1;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', ".glitch-assets", true);
  var self = this;  
  self.elements=[];
  if (typeof mainScene !== 'undefined') mainScene.Loader.Push(self);  
  
  xhr.onload = function(e){
    if (this.status == 200) {
      var str = this.response.split("\n").join(",\n");
      var elems = JSON.parse('{"elems":[' + str + "{}]}").elems;
      for( var i=0;i<elems.length;++i){
        if(("date" in elems[i])){
          if(self.elements[elems[i].name]!=null){
            if(elems[i].date > self.elements[elems[i].name].date){
               self.elements[elems[i].name]  = elems[i];
            }
          }
          else
            self.elements[elems[i].name]  = elems[i];
          self.elements[elems[i].name].url = self.elements[elems[i].name].url+"?"+Date.parse(self.elements[elems[i].name].date);
        }
      }
    }
    Assets.instance = self;    
    if("then" in self) self.then(self);
    if (typeof mainScene !== 'undefined') mainScene.Loader.Pop(self);
  }
  xhr.send();
}

Assets.prototype.getURL = function(name){
  if(this.onGlitch)
    return this.elements[name].url;  
return "Assets/"+name;
};function Camera() {
  this.name = "Camera";
  this.viewProjectionMatrix = new Matrix4();
  this.viewMatrix = new Matrix4();
  this.Position(new Vector3());
  this.Rotation(new Quaternion());
  
  gl.clearColor(0, 0, 0, 0);
  gl.clearDepth(1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  this.projectionMatrix = new Matrix4();
  this.projectionMatrix.perspective( 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 20.0);
}

Camera.prototype.Position = function (p) { this.position=p; this.dirty = true;}
Camera.prototype.Rotation = function (q) { this.rotation=q; this.dirty = true;}

Camera.prototype.Update = function(){
  if(this.dirty){
    var rotationMatrix = this.rotation.ToMatrix();
//    var rotationMatrix = new Matrix4();
    //rotationMatrix.fromQuaternion(this.rotation);
    var positionMatrix = new Matrix4();

    positionMatrix.position( this.position.Neg() );
    this.viewMatrix.multiply(rotationMatrix, positionMatrix );

    this.viewProjectionMatrix.multiply(this.projectionMatrix, this.viewMatrix );
    this.dirty=false;
  }
}

;function Color( r, g, b, a ) {
	this._r = r || 0;
	this._g = g || 0;
	this._b = b || 0;
	this._a = a || 1;
}

Color.prototype.ToArray = function(arr){
  arr.push(this._r);
  arr.push(this._g);
  arr.push(this._b);
  arr.push(this._a);
};function Confetti(shader) {

this.shader = shader;
/*
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        precision lowp float;

        attribute vec2 a_position; // Flat square on XY plane
        attribute float a_startAngle;
        attribute float a_angularVelocity;
        attribute float a_rotationAxisAngle;
        attribute float a_particleDistance;
        attribute float a_particleAngle;
        attribute float a_particleY;
        uniform float u_time; // Global state

        varying vec2 v_position;
        varying vec3 v_color;
        varying float v_overlight;

        void main() {
            float angle = a_startAngle + a_angularVelocity * u_time;
            float vertPosition = 1.1 - mod(u_time * .25 + a_particleY, 2.2);
            float viewAngle = a_particleAngle + mod(u_time * .25, 6.28);

            mat4 vMatrix = mat4(
                4.29, 0.0, 0.0, 0.0,
                0.0, 2.41, 0.0, 0.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 0.2, 0
            );

            mat4 shiftMatrix = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                a_particleDistance * sin(viewAngle), vertPosition, a_particleDistance * cos(viewAngle), 1.0
            );

            mat4 pMatrix = mat4(
                cos(a_rotationAxisAngle), sin(a_rotationAxisAngle), 0.0, 0.0,
                -sin(a_rotationAxisAngle), cos(a_rotationAxisAngle), 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
                ) * mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, cos(angle), sin(angle), 0.0,
                0.0, -sin(angle), cos(angle), 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            gl_Position = vMatrix * shiftMatrix * pMatrix * vec4(a_position * 0.03, 0.0, 1.0);
            vec4 normal = vec4(0.0, 0.0, 1.0, 0.0);
            vec4 transformedNormal = normalize(pMatrix * normal);

            float dotNormal = abs(dot(normal.xyz, transformedNormal.xyz));
            float regularLighting = dotNormal / 2.0 + 0.5;
            float glanceLighting = smoothstep(0.92, 0.98, dotNormal);
            v_color = vec3(
                mix((0.5 - transformedNormal.z / 2.0) * regularLighting, 1.0, glanceLighting),
                mix(0.5 * regularLighting, 1.0, glanceLighting),
                mix((0.5 + transformedNormal.z / 2.0) * regularLighting, 1.0, glanceLighting)
            );

            v_position = a_position;
            v_overlight = 0.9 + glanceLighting * 0.1;
        }
    `);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision lowp float;
        varying vec2 v_position;
        varying vec3 v_color;
        varying float v_overlight;

        void main() {
            gl_FragColor = vec4(v_color, 1.0 - smoothstep(0.8, v_overlight, length(v_position)));
        }
    `);
    gl.compileShader(fragmentShader);

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
*/
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer );

    var STRIDE = 8;
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    NUM_PARTICLES = 300;
    var NUM_VERTICES = 4;
    NUM_INDICES = 6;

    this.elements = NUM_INDICES * NUM_PARTICLES

    var vertices = new Float32Array(NUM_PARTICLES * STRIDE * NUM_VERTICES);
    var indices = new Uint16Array(NUM_PARTICLES * NUM_INDICES);
    for (var i = 0; i < NUM_PARTICLES; i++) {
        var axisAngle = Math.random() * Math.PI * 2;
        var startAngle = Math.random() * Math.PI * 2
        var groupPtr = i * STRIDE * NUM_VERTICES;

        var particleDistance = Math.sqrt(Math.random());
        var particleAngle = Math.random() * Math.PI * 2;
        var particleY = Math.random() * 2.2;
        var angularVelocity = Math.random() * 2 + 1;

        for (var j = 0; j < 4; j++) {
            var vertexPtr = groupPtr + j * STRIDE;
            vertices[vertexPtr + 2] = startAngle; // Start angle
            vertices[vertexPtr + 3] = angularVelocity; // Angular velocity
            vertices[vertexPtr + 4] = axisAngle; // Angle diff
            vertices[vertexPtr + 5] = particleDistance; // Distance of the particle from the (0,0,0)
            vertices[vertexPtr + 6] = particleAngle; // Angle around Y axis
            vertices[vertexPtr + 7] = particleY; // Angle around Y axis
        }

        // Cooridnates
        vertices[groupPtr] = vertices[groupPtr + STRIDE * 2] = -1;
        vertices[groupPtr + STRIDE] = vertices[groupPtr + STRIDE * 3] = +1;
        vertices[groupPtr + 1] = vertices[groupPtr + STRIDE + 1] = -1;
        vertices[groupPtr + STRIDE * 2 + 1] = vertices[groupPtr + STRIDE * 3 + 1] = +1;


        var indicesPtr = i * this.NUM_INDICES;
        var vertexPtr = i * NUM_VERTICES;
        indices[indicesPtr] = vertexPtr;
        indices[indicesPtr + 4] = indices[indicesPtr + 1] = vertexPtr + 1;
        indices[indicesPtr + 3] = indices[indicesPtr + 2] = vertexPtr + 2;
        indices[indicesPtr + 5] = vertexPtr + 3;
    }
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

 //   this.timeUniformLocation = gl.getUniformLocation(this.shaderProgram, 'u_time');
    this.startTime = (window.performance||Date).now();
}


Confetti.prototype.Draw = function(scene){
    
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  this.shader.Use(gl);
  //gl.useProgram(this.shaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
/*
  var STRIDE = 8;
  var attrs = [
      {name: 'a_position', length: 2, offset: 0},
      {name: 'a_startAngle', length: 1, offset: 2},
      {name: 'a_angularVelocity', length: 1, offset: 3},
      {name: 'a_rotationAxisAngle', length: 1, offset: 4},
      {name: 'a_particleDistance', length: 1, offset: 5},
      {name: 'a_particleAngle', length: 1, offset: 6},
      {name: 'a_particleY', length: 1, offset: 7},
  ];
  for (var i = 0; i < attrs.length; i++) {
      var name = attrs[i].name;
      var length = attrs[i].length;
      var offset = attrs[i].offset;
      var attribLocation = gl.getAttribLocation(this.shaderProgram, name);
      gl.vertexAttribPointer(attribLocation, length, gl.FLOAT, false, STRIDE * 4, offset * 4);
      gl.enableVertexAttribArray(attribLocation);
  }
*/

//  gl.uniform1f(this.timeUniformLocation, 0);//((window.performance||Date).now() - this.startTime) / 1000);
  //  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, 0);
  gl.disable(gl.BLEND);
};function Loader(scene,OnReady) {
  this.name = "Loader";
  this.Scene = scene;
  this.OnReady = OnReady;
  this.Pending = [];
}

Loader.prototype.Push = function (element) {
  this.Pending.push(element);
}

Loader.prototype.Pop = function (element) {
  var index = this.Pending.indexOf(element);
  this.Pending.splice(index, 1);
  if(this.Pending.length==0) this.OnReady(this.Scene);
}

;function Matrix4() {
	this.elements = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}

Matrix4.prototype.identity = function () {
	this.elements = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
return this;
}

Matrix4.prototype.copy = function () {
	var m = new Matrix4();
	for(var i=0;i<16;++i)
		m.elements[i]= this.elements[i];
return m;
}

Matrix4.prototype.rotationEuler = function ( x,y,z ) {
	var te = this.elements;

	var a = Math.cos(x), b = Math.sin(x);
	var c = Math.cos(y), d = Math.sin(y);
	var e = Math.cos(z), f = Math.sin(z);

    var ae = a * e, af = a * f, be = b * e, bf = b * f;

    te[ 0 ] = c * e;
    te[ 4 ] = - c * f;
    te[ 8 ] = d;

    te[ 1 ] = af + be * d;
    te[ 5 ] = ae - bf * d;
    te[ 9 ] = - b * c;

    te[ 2 ] = bf - ae * d;
    te[ 6 ] = be + af * d;
    te[ 10 ] = a * c;
  
return this;
}

/*
Matrix4.prototype.rotation = function ( q ) {
	var te = this.elements;
	var x = q._x, y = q._y, z = q._z, w = q._w;
	var x2 = x + x, y2 = y + y, z2 = z + z;
	var xx = x * x2, xy = x * y2, xz = x * z2;
	var yy = y * y2, yz = y * z2, zz = z * z2;
	var wx = w * x2, wy = w * y2, wz = w * z2;

	te[ 0 ] = 1 - ( yy + zz );
	te[ 4 ] = xy - wz;
	te[ 8 ] = xz + wy;

	te[ 1 ] = xy + wz;
	te[ 5 ] = 1 - ( xx + zz );
	te[ 9 ] = yz - wx;

	te[ 2 ] = xz - wy;
	te[ 6 ] = yz + wx;
	te[ 10 ] = 1 - ( xx + yy );

	return this;
}
*/

Matrix4.prototype.multiply = function ( a, b ) {
	var ae = a.elements;
	var be = b.elements;
	var te = this.elements;

	var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
	var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
	var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
	var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

	var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
	var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
	var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
	var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

	te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

	return this;
}

Matrix4.prototype.multiplyVector = function ( a ) {
	var te = this.elements;
	var x = a.x * te[0] + a.y * te[4] + a.z * te[8];
	var y = a.x * te[1] + a.y * te[5] + a.z * te[9];
	var z = a.x * te[2] + a.y * te[6] + a.z * te[10];

	return new Vector3(x,y,z);
}

Matrix4.prototype.transposeMultiplyVector = function ( a ) {
	var te = this.elements;
	var x = a.x * te[0] + a.y * te[1] + a.z * te[2];
	var y = a.x * te[4] + a.y * te[5] + a.z * te[6];
	var z = a.x * te[8] + a.y * te[9] + a.z * te[10];

	return new Vector3(x,y,z);
}

Matrix4.prototype.transpose = function (a) {
	var te = this.elements;
	var tmp;  
	te[0]=a[4]; te[1]=a[4]; te[ 2]=a[ 8];
  te[4]=a[1]; te[5]=a[5]; te[ 6]=a[ 9];
  te[8]=a[2]; te[9]=a[6]; te[10]=a[10];
	return this;
}

Matrix4.prototype.invert = function(a) {
	var te = this.elements;
  var a00 = a[ 0], a01 = a[ 1], a02 = a[ 2], a03 = a[ 3];
  var a10 = a[ 4], a11 = a[ 5], a12 = a[ 6], a13 = a[ 7];
  var a20 = a[ 8], a21 = a[ 9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  te[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  te[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  te[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  te[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  te[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  te[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  te[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  te[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  te[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  te[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  te[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  te[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  te[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  te[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  te[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  te[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return this;
}
  


Matrix4.prototype.position = function ( p ) {
	var te = this.elements;

	te[ 12 ] = p._x;
	te[ 13 ] = p._y;
	te[ 14 ] = p._z;

	return this;
}

Matrix4.prototype.scale = function ( s ) {
	var te = this.elements;
  
	te[ 0 ] *= s._x;
	te[ 5 ] *= s._y;
	te[ 10 ] *= s._z;
  
	return this;
}

Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
  var te = this.elements;
  var f = 1.0 / Math.tan(fovy / 2);
  var nf = 1 / (near - far);
  te[0] = f / aspect;
  te[1] = 0;
  te[2] = 0;
  te[3] = 0;
  
  te[4] = 0;
  te[5] = f;
  te[6] = 0;
  te[7] = 0;
  
  te[8] = 0;
  te[9] = 0;
  te[10] = (near-far) * nf;
  te[11] = 1;
  
  te[12] = 0;
  te[13] = 0;
  te[14] = 2 * far * near * nf;
  te[15] = 0;
  
  return this;
}

Matrix4.prototype.fromQuaternion =  function( q ) {

		var te = this.elements;

		var x = q._x, y = q._y, z = q._z, w = q._w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;
};function Mesh(shader) {
  this.name = "Mesh";
  this.shader = shader;
  this.submeshes = [];
  this.modelMatrix = new Matrix4();
  this.normalMatrix = new Matrix4();
  this.modelViewMatrix = new Matrix4();
  this.modelViewProyectionMatrix = new Matrix4();
  this.textures = [];
  this.Position(0,0,0);
  this.Rotation(new Quaternion());
}

Mesh.prototype.Load = function(url, onLoad ){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var self = this;
  
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      var positions = [];
      var normals = [];
      var tangents = [];
      var uvs = [];
      var indices = []; 
      var idx = 0;
      
      var vertices = view.getUint16(idx,true); idx+=2;
      for (var i = 0; i < vertices; i++) {
        positions.push( view.getFloat32(idx,true) ); idx+=4;
        positions.push( view.getFloat32(idx,true) ); idx+=4;
        positions.push( view.getFloat32(idx,true) ); idx+=4;
      }
      self.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      for (var i = 0; i < vertices; i++) {
        normals.push( view.getFloat32(idx,true) ); idx+=4;
        normals.push( view.getFloat32(idx,true) ); idx+=4;
        normals.push( view.getFloat32(idx,true) ); idx+=4;
      }
      self.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      
      for (var i = 0; i < vertices; i++) {
        tangents.push( view.getFloat32(idx,true) ); idx+=4;
        tangents.push( view.getFloat32(idx,true) ); idx+=4;
        tangents.push( view.getFloat32(idx,true) ); idx+=4;
        tangents.push( view.getFloat32(idx,true) ); idx+=4;
      }
      self.tangentsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.tangentsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
      
      for (var i = 0; i < vertices; i++) {
        var u = view.getFloat32(idx,true); idx+=4;
        var v = view.getFloat32(idx,true); idx+=4;
        uvs.push( u); 
        uvs.push(-v);
      }
      self.textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, self.textureCoordBuffer);      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW );
      
      var indexOffset = 0;
      var subMeshCount = view.getUint16(idx,true); idx+=2;
      for (var j = 0; j < subMeshCount; j++) {
        var indexCount = view.getUint16(idx,true); idx+=2;
        self.submeshes.push( { offset:indexOffset, count: indexCount } );
        for (var i = 0; i < indexCount; i++) {
          indices.push( view.getUint16(idx,true) ); idx+=2;
        }
        indexOffset += indexCount;
      }
      self.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);      
      
      onLoad(self);
      
      mainScene.Loader.Pop(self);
    }        
  };
  xhr.send();
  return this;
}

Mesh.prototype.Draw = function(scene){
  var shader = this.shader;
  shader.Use(gl);
  
  if(this.dirty) {
    
    var rotationMatrix = new Matrix4();
    rotationMatrix.fromQuaternion(this.rotation);
    var positionMatrix = new Matrix4();
    positionMatrix.position( this.position);
    this.modelMatrix.multiply(positionMatrix,rotationMatrix );
    this.normalMatrix.fromQuaternion(this.rotation);
    this.dirty=false;
  }  
    this.modelViewProyectionMatrix.multiply(scene.camera.viewProjectionMatrix,this.modelMatrix );

  shader.setNormalMatrix(this.normalMatrix);
  shader.setModelViewProjectionMatrix(this.modelViewProyectionMatrix);
  shader.setModelMatrix(this.modelMatrix);
  
  shader.BindBuffers(this);
  if(this.normal) shader.UseNormal(this.normal);
  for( var i=0;i<this.submeshes.length;++i){ 
    shader.UseTexture(this.textures[i],0);
    gl.drawElements(gl.TRIANGLES, this.submeshes[i].count, gl.UNSIGNED_SHORT, this.submeshes[i].offset*2);
  }
}

Mesh.prototype.Position = function (p) { this.position=p; this.dirty = true;}
Mesh.prototype.Rotation = function (q) { this.rotation=q; this.dirty = true;}
;function Quad() {
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
  };function Quaternion( x, y, z, w ) {
	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;
}

Quaternion.Lerp = function(a,b,t){
  var it = 1-t;
  return new Quaternion( a._x*it+b._x*t, a._y*it+b._y*t, a._z*it+b._z*t, a._w*it+b._w*t);
}

Quaternion.prototype.ToMatrix = function(){
  var m = new Matrix4();
  
  var sqw = this._w*this._w;
  var sqx = this._x*this._x;
  var sqy = this._y*this._y;
  var sqz = this._z*this._z;

    // invs (inverse square length) is only required if quaternion is not already normalised
  var invs = 1 / (sqx + sqy + sqz + sqw);
  
  m.elements[0] = ( sqx - sqy - sqz + sqw)*invs ; // since sqw + sqx + sqy + sqz =1/invs*invs
  m.elements[5] = (-sqx + sqy - sqz + sqw)*invs ;
  m.elements[10] = (-sqx - sqy + sqz + sqw)*invs ;
    
  var tmp1 = this._x*this._y;
  var tmp2 = this._z*this._w;
  m.elements[4] = 2.0 * (tmp1 + tmp2)*invs ; // m10
  m.elements[1] = 2.0 * (tmp1 - tmp2)*invs ; // m01

  var tmp1 = this._x*this._z;
  var tmp2 = this._y*this._w;
  m.elements[8] = 2.0 * (tmp1 - tmp2)*invs ; // m20
  m.elements[2] = 2.0 * (tmp1 + tmp2)*invs ; // m02
  var tmp1 = this._y*this._z;
  var tmp2 = this._x*this._w;
  m.elements[9] = 2.0 * (tmp1 + tmp2)*invs ; // m21
  m.elements[6] = 2.0 * (tmp1 - tmp2)*invs ; // m12
  
return m;
};function Results() {
  this.name="Anim";
  this.current = null;
}

Results.prototype.Load = function(url, nocache, onLoad ){
  var xhr = new XMLHttpRequest();
  if(nocache!=null) url+='?_=' + new Date().getTime();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
 
  var self = this;

  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {
      var view = new DataView( this.response );
      var idx=0;
      self.valores = [];
      for(var j=0;j<6;j++){
        var value = { count:view.getUint16(idx,true), result: [] };
        idx+=2;        
        self.valores.push(value);
        for(var i=0;i<self.valores[j].count;i++){
          self.valores[j].result[i] = new Result();
          idx = self.valores[j].result[i].Load(view,idx);
        }
      }

      if(onLoad!=undefined) onLoad(self);
      mainScene.Loader.Pop(self);
    }
  }
  xhr.onerror = function(e) {
      console.error(xhr.statusText);
  };    
  xhr.send(null);
 
}

Results.prototype.Update = function(deltaTime, dice, camera ){
  if(this.current!=null){
    if( !this.current.Update(deltaTime, dice, camera) ){      
      this.current=null;
      return false;
    }
  }
  return true;
}

Results.prototype.getRandomInt = function(min, max) {
    return Math.floor( Math.random() * (max - min + 1)) + min;
}

Results.prototype.Throw = function(value){
  var rand = this.getRandomInt(0,4);
  this.current = this.valores[value-1].result[rand];
  this.current.Reset();
}

function Value() {
}

function Result() {
  this.currentIndex = 0;
  this.time = 0;
}

Result.prototype.Reset = function(){
  
  this.currentIndex = 0;
  this.time = 0;
}

Result.prototype.Load = function(view,idx){
    this.frames = view.getUint16(idx,true); idx+=2;
    this.scaleTime = [];
    this.dicePosition =[];
    this.diceRotation =[];
    this.cameraPosition =[];
    this.cameraRotation =[];
    for(var i=0;i<this.frames;i++){ 
      this.scaleTime.push(view.getFloat32(idx,true)); // <-- se leera del fichero
      idx+=4;
    }
    for(var i=0;i<this.frames;i++){ 
        this.dicePosition.push( new Vector3( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true) ) );
        idx+=12;
    }
    for(var i=0;i<this.frames;i++){ 
      this.diceRotation.push(new Quaternion( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true), view.getFloat32(idx+12,true) ) );
      idx+=16;
    }
    for(var i=0;i<this.frames;i++){ 
      this.cameraPosition.push( new Vector3( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true) ) );
      idx+=12;
    }
    for(var i=0;i<this.frames;i++){ 
      this.cameraRotation.push(new Quaternion( view.getFloat32(idx,true), view.getFloat32(idx+4,true), view.getFloat32(idx+8,true), view.getFloat32(idx+12,true) ) );
      idx+=16;
    }
  return idx;
}

Result.prototype.Update = function(deltaTime, dice, camera){
    this.time += deltaTime*this.scaleTime[this.currentIndex];
    if(this.time > 0.03) {
      this.time=0.00;      
      if(this.currentIndex >= this.frames-2) {
        return false;
      }
      else
        this.currentIndex++;
    }
    var t =  this.time/0.03;
    camera.Position( Vector3.Lerp(this.cameraPosition[this.currentIndex],this.cameraPosition[this.currentIndex+1], t ) );
    camera.Rotation(Quaternion.Lerp(  this.cameraRotation[this.currentIndex],this.cameraRotation[this.currentIndex+1],t));
    
    dice.Position( Vector3.Lerp(this.dicePosition[this.currentIndex],this.dicePosition[this.currentIndex+1], t ) );
    dice.Rotation( Quaternion.Lerp(this.diceRotation[this.currentIndex],this.diceRotation[this.currentIndex+1],t));
return true;
}
;var mainScene;

function Scene() {
  mainScene = this;
  this.camera = new Camera();
  this.name = "Scene";
  this.Entities = [];  
  this.Loader = new Loader(this, this.OnReady );
  this.blurCleaner = new Quad();
  this.blur = 0.5;
}

Scene.prototype.Push = function (entity) {
  this.Entities.push(entity);
  return entity;
}

Scene.prototype.CreateMesh = function(shader){
  return this.Push(new Mesh(shader));
}

Scene.prototype.Draw = function() {
  if(this.blur==0)  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  else{
    gl.clear(gl.DEPTH_BUFFER_BIT);
    this.blurCleaner.Draw(this.blur);
  }
  this.camera.Update();
  for( var i=0;i<this.Entities.length;++i){
    this.Entities[i].Draw(this);
  }
}

Scene.prototype.OnReady = function(self){
  var then = 0;
  function render(now) {    
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    if(self.Update!=undefined) self.Update(deltaTime);
    self.Draw();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
;var currentShader;

function Shader(url, nocache, OnLoad ){
  this.name = "Shader";
  this.OnLoad = OnLoad;
  this.Load(url, nocache);
}

Shader.prototype.Load = function(url, nocache){
  this.name=url;
  var xhr = new XMLHttpRequest();
  if(nocache!=null) url+='?_=' + new Date().getTime();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  var self = this;
  
  mainScene.Loader.Push(self);  
  xhr.onload = function(e){
    if (this.status == 200) {

      var vertexStar = this.response.indexOf("[vertex]");
      var faceStar = this.response.indexOf("[face]");
      var vsSource = this.response.substring(vertexStar+8,faceStar);
      var fsSource = this.response.substring(faceStar+6);
      self.Init(vsSource,fsSource);
      if (self.then!=undefined) self.then(self);
      mainScene.Loader.Pop(self);
    }
  }
  xhr.send();
}

Shader.prototype.Init = function(vsSource,fsSource){
  const vertexShader   = this.LoadShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = this.LoadShader(gl.FRAGMENT_SHADER, fsSource);
  
  this.shaderProgram = gl.createProgram();
  gl.attachShader(this.shaderProgram, vertexShader);
  gl.attachShader(this.shaderProgram, fragmentShader);
  gl.linkProgram(this.shaderProgram);

  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.shaderProgram));
    return null;
  }
  
  this.attribLocations = {
    vertexPosition:   gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
    vertexNormal:     gl.getAttribLocation(this.shaderProgram, 'aVertexNormal'),
    textureCoord:     gl.getAttribLocation(this.shaderProgram, 'aTextureCoord'),
    vertexTangent:    gl.getAttribLocation(this.shaderProgram, 'aVertexTangent'),
    vertexColor:      gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
  };
  this.uniformLocations = {
    modelMatrix:                gl.getUniformLocation(this.shaderProgram, 'uModelMatrix'),
    modelViewProjectionMatrix:  gl.getUniformLocation(this.shaderProgram, 'uModelViewProjectionMatrix'),
    normalMatrix:               gl.getUniformLocation(this.shaderProgram, 'uNormalMatrix'),
    uSampler:                   gl.getUniformLocation(this.shaderProgram, 'uSampler'),
    uNormalSampler:             gl.getUniformLocation(this.shaderProgram, 'uNormalSampler'),
    alpha:                      gl.getUniformLocation(this.shaderProgram, 'Alpha'),
  }
}

Shader.prototype.Use = function(){
  if(currentShader!=this){
    gl.useProgram(this.shaderProgram);
    currentShader=this;
  }
}

Shader.prototype.UseTexture= function(texture){
  if(texture!=undefined){
    this.Use();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);    
    gl.uniform1i(this.uniformLocations.uSampler, 0);
  }
}

Shader.prototype.UseNormal= function(texture){
  if(texture!=undefined){
    this.Use();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);    
    gl.uniform1i(this.uniformLocations.uNormalSampler, 1);
  }
}

Shader.prototype.LoadShader = function(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

Shader.prototype.setModelViewProjectionMatrix = function(matrix){
  this.Use();
  gl.uniformMatrix4fv( this.uniformLocations.modelViewProjectionMatrix, false, matrix.elements);
}
Shader.prototype.setModelMatrix = function(matrix){
  this.Use();
  if(this.uniformLocations.modelMatrix!=-1)gl.uniformMatrix4fv( this.uniformLocations.modelMatrix, false, matrix.elements);
}

Shader.prototype.setNormalMatrix = function(matrix){
  this.Use();
  gl.uniformMatrix4fv( this.uniformLocations.normalMatrix, false, matrix.elements);
}

Shader.prototype.BindBuffers = function(mesh){
  this.Use();
  if(this.attribLocations.vertexPosition!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.attribLocations.vertexPosition); 
  }

  if(this.attribLocations.vertexNormal!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.vertexNormal);
  }
    
  if(this.attribLocations.vertexTangent!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.tangentsBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexTangent, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.vertexTangent);
  }
    
  if(this.attribLocations.textureCoord!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureCoordBuffer);
    gl.vertexAttribPointer( this.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.textureCoord);
  }
  if(this.attribLocations.vertexColor!=-1){
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
    gl.vertexAttribPointer( this.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.attribLocations.vertexColor);
  }
   
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
}

Shader.prototype.setAlpha = function(a){
  this.Use();
  gl.uniform1f(this.uniformLocations.alpha, a);
}

;function Texture() {
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
;function Vector3( x, y, z ) {
	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
}

Vector3.Lerp = function(a,b,t){
  var it = 1-t;
  return new Vector3( a._x*it+b._x*t, a._y*it+b._y*t, a._z*it+b._z*t);
}

Vector3.prototype.Neg = function(){
    return new Vector3(-this._x,-this._y,-this._z);
}
;//var table;
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

