let http = require('http');

class ProxyClient {
  constructor (port) {
    this.options = {
      hostname: '127.0.0.1',
      port: port,
      path: '/task',
      method: 'POST'
    };
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
    req.end(task.toString());
  }
};

module.exports = ProxyClient;