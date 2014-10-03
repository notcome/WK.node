let express = require('express');
let http = require('http');
let socketIO = require('socket.io');

let DispatchQueue = require('./dispatch_queue');
let initRouters = require('./init_routers');

function forwardTaskResult (msg, queue) {
  let { id, transformed, error } = JSON.parse(msg);
  let [req, res, next] = queue.pop(id);

  res.send(JSON.stringify({
    transformed: transformed,
    error: error
  }));
  next();
}

class ProxyServer {
  constructor (port) {
    this.port   = port;
    this.app    = express();
    this.server = http.Server(this.app);
    this.io     = socketIO(this.server);

    this.queue  = new DispatchQueue();
    initRouters(this.app, this.io, this.queue);

    let self = this;
    this.io.on('connection', socket => {
      socket.on('ready', () => self.emitReady());
      socket.on('node.task', msg => forwardTaskResult(msg, this.queue));
    });

    this.server.listen(port, () => {
      console.log('listening on *:', port);
      console.log('waiting for connection');
    });

    this.ready = false;
    this.waitList = [];
  }

  onReady (f) {
    if (this.ready)
      f();
    this.waitList.push(f);
  }

  emitReady () {
    if (this.ready)
      return;
    this.ready = true;
    console.log('worker connected');
    this.waitList.forEach(f => f());
  }
};

module.exports = ProxyServer;