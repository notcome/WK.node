function sendfile (res, path) {
  res.sendFile(path, { root: __dirname + '/client-side/' });
}

function init (app, io, queue) {
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

  app.get('/', (req, res) => sendfile(res, 'index.html'));
  app.get('/public/:file', (req, res) => sendfile(res, req.params.file));

  return app;
}

module.exports = init;