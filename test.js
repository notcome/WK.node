let {
  ProxyServer,
  ProxyClient,
  Task
} = require('./main');

let server = new ProxyServer(3000);
server.onReady(function () {
  let client = new ProxyClient(3000);

  let html = '<article><h1 id="Hello"></h1></article>';
  let task = new Task(html, (container) => {
    var node = container.getElementById('Hello');
    node.innerHTML = 'Hello, world!';
  });

  client.submitTask(task, (err, data) => {
    console.log('error:', err);
    console.log('result:', data);
  });
});
