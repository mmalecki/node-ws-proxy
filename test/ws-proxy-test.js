var test = require('tap').test,
    ws = require('ws'),
    wsProxy = require('../');

test("ws-proxy", function (t) {
  var server = new ws.Server({ port: 8000 }),
      proxy = wsProxy.createServer('ws://localhost:8000');

  server.on('connection', function (serverSocket) {
    serverSocket.on('message', function (msg) {
      t.equal(msg, 'hello world', 'message should be equal to message sent');

      server.close();
      proxy.close();

      t.end();
    });
  });

  proxy.listen(9000, function () {
    var socket = new ws('ws://localhost:9000');

    socket.on('open', function () {
      socket.send('hello world');
    });
  });
});

