var socket = io();
var canvas = document.getElementById('canvas');
var finished = 0;
var counter = document.getElementById('counter');

socket.on('node.task', function (msg) {
  var { html, args, code, id } = JSON.parse(msg);
  var transformer = eval(code).apply(null, args);

  var container = document.createElement('div');
  canvas.appendChild(container);
  container.innerHTML = html;

  try {
    transformer(container);
    socket.emit('node.task', JSON.stringify({
      id: id,
      transformed: container.innerHTML
    }));
  }
  catch (e) {
    socket.emit('node.task', JSON.stringify({
      id: id,
      error: e.message
    }));
  }

  counter.innerText = ++ finished;
  canvas.removeChild(container);
});
