function Loader(scene,OnReady) {
  this.name = "Loader";
  this.Scene = scene;
  this.OnReady = OnReady;
  this.Pending = [];
}

Loader.prototype.Push = function (element) {
  console.log("Push "+element.name);
  this.Pending.push(element);
}

Loader.prototype.Pop = function (element) {
  console.log("Pop "+element.name);
  var index = this.Pending.indexOf(element);
  this.Pending.splice(index, 1);
  if(this.Pending.length==0) this.OnReady(this.Scene);
}

