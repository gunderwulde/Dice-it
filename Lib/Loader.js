function Loader(onReady) {
  this.OnReady = onReady;
  this.Pending = [];
}

Loader.prototype.Push = function (element) {
  this.Pending.push(element);
}

Loader.prototype.Pop = function (element) {
  var index = this.Pending.indexOf(element);
  this.Pending.splice(index, 1);
  if()
}

