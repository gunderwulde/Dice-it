function Quaternion( x, y, z, w ) {
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
}