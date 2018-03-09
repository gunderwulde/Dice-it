function Loader(OnReady) {
  this.name = "Loader";
  this.OnReady = OnReady;
  this.Pending = [];
}

Loader.prototype.Push = function (element) {
  this.Pending.push(element);
}

Loader.prototype.Pop = function (element) {
  var index = this.Pending.indexOf(element);
  this.Pending.splice(index, 1);
  if(this.Pending.length==0) this.OnReady();
}

