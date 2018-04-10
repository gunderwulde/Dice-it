function Color( r, g, b, a ) {
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
}