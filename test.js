var http = require('http');

class WKNodeServer {
  constructor (port, hostname = '127.0.0.1') {
    this.options = {
      hostname: hostname,
      port: port,
      path: '/task',
      method: 'POST'
    };
    this.http = require('http');
  }

  submitTask(task, cb) {
    let req = http.request(this.options, function (res) {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let { transformed, error } = JSON.parse(data);
        cb(error, transformed)
      });
    });

    req.on('error', err => cb(err));
    console.log('hello');
    req.end(task.toString());
  }
}

class Task {
  constructor (html, func, args) {
    let code = func.toString();
    if (args)
      this.code = '(' + code + ')';
    else
      this.code = '( function () { return ' + code + '})';

    this.html = html;
    this.args = args || [];
  }

  toString () {
    return JSON.stringify({
      args: this.args,
      code: this.code,
      html: this.html
    });
  }
}

var html = '<article><h1 id="Hello"></h1></article>'
var task = new Task(html, (container) => {
  var node = container.getElementById('Hello');
  node.innerHTML = 'Hello, world!';
});

var server = new WKNodeServer(3000);

server.submitTask(task, (err, data) => {
  console.log('error:', err);
  console.log('result:', data);
});
