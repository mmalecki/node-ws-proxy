var ws = require('ws'),
    WebSocketServer = ws.Server;

var WSProxy = exports.WSProxy = function (options) {
  options || (options = {});

  if (!options.target) {
    throw new TypeError("No target given");
  }
  this.target = options.target;

  if (!options.proxy || !options.proxy.port) {
    throw new TypeError("No port to listen on given");
  }
  this.proxy = options.proxy;
  this.proxy.host || (this.proxy.host = "127.0.0.1");

  this.server = null;
};

WSProxy.prototype.start = function () {
  var self = this;

  if (this.server) {
    throw new Error("Already running");
  }

  this.server = new WebSocketServer(this.proxy);
  this.server.on('connection', function (incoming) {
    var outgoing = new ws(self.target);
    
    incoming.on('message', function (msg) {
      outgoing.send(msg);
    });

    outgoing.on('message', function (msg) {
      incoming.send(msg);
    });
  });
};

WSProxy.prototype.stop = function () {
  if (!this.server) {
    throw new Error("Not running");
  }

  this.server.close();
  this.server = null;
};

