class DispatchQueue {
  constructor () {
    this.callbacks = {};
    this.counter = 0;
  }

  push (callback) {
    let id = this.counter ++;
    this.callbacks[id] = callback;
    return id;
  }

  pop (id) {
    let callback = this.callbacks[id];
    delete this.callbacks[id];
    return callback;
  }
};

module.exports = DispatchQueue;