function Vector3( x, y, z ) {
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
