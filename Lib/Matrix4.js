function Matrix4() {
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
}