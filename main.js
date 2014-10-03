let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let queue = require('./dispatch_queue')();

app.post('/task', function (req, res, next) {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    req.body = data;
    next();
  });
});

app.post('/task', function (req, res, next) {
  let { html, args, code } = JSON.parse(req.body);
  let taskID = queue.push([req, res, next]);
  io.emit('node.task', JSON.stringify({
    html: html,
    args: args,
    code: code,
    id: taskID
  }));
});

io.on('connection', function (socket) {
  socket.on('node.task', function (msg) {
    let { id, transformed, error } = JSON.parse(msg);

    console.log(JSON.parse(msg, null, 2));

    let [req, res, next] = queue.pop(id);
    res.send(JSON.stringify({
      transformed: transformed,
      error: error
    }));
    next();
  });
});

function sendfile (res, path) {
  res.sendFile(path, { root: __dirname + '/client-side/' });
}

app.get('/', (req, res) => sendfile(res, 'index.html'));
app.get('/public/:file', (req, res) => sendfile(res, req.params.file));

http.listen(3000, () => console.log('listening on *:3000'));
