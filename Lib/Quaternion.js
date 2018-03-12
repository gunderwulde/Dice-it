function Quaternion( x, y, z, w ) {
	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;
}

Quaternion.prototype.ToMatrix = function(){
  var m = new Matrix();
  var sqw = q.w*q.w;
  var sqx = q.x*q.x;
  var sqy = q.y*q.y;
   var sqz = q.z*q.z;

    // invs (inverse square length) is only required if quaternion is not already normalised
  var invs = 1 / (sqx + sqy + sqz + sqw);
  
  m.elements[0] = ( sqx - sqy - sqz + sqw)*invs ; // since sqw + sqx + sqy + sqz =1/invs*invs
  m.elements[5] = (-sqx + sqy - sqz + sqw)*invs ;
  m.elements[10] = (-sqx - sqy + sqz + sqw)*invs ;
    
  var tmp1 = q.x*q.y;
  var tmp2 = q.z*q.w;
  m.elements[4] = 2.0 * (tmp1 + tmp2)*invs ; // m10
  m.elements[1] = 2.0 * (tmp1 - tmp2)*invs ; // m01

  var tmp1 = q.x*q.z;
  var tmp2 = q.y*q.w;
  m.elements[8] = 2.0 * (tmp1 - tmp2)*invs ; // m20
  m.elements[2] = 2.0 * (tmp1 + tmp2)*invs ; // m02
  var tmp1 = q.y*q.z;
  var tmp2 = q.x*q.w;
  m.elements[9] = 2.0 * (tmp1 + tmp2)*invs ; // m21
  m.elements[6] = 2.0 * (tmp1 - tmp2)*invs ; // m12
  
return m;
}