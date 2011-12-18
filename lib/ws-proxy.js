var util = require('util'),
    ws = require('ws'),
    WebSocketServer = ws.Server,
    EventEmitter2 = require('eventemitter2').EventEmitter2;

exports.createServer = function createServer(target) {
};

var WSProxy = exports.WSProxy = function (target) {
  if (!target) {
    throw new TypeError("No target given");
  }
  this.target = target;

  this.server = null;

  EventEmitter2.call(this, {
    delimeter: '::',
    wildcard: true
  });
};
util.inherits(WSProxy, EventEmitter2);

WSProxy.prototype.listen = function (port, host) {
  var self = this;

  function listening() {
    self.emit('listening');
  }

  if (typeof arguments[arguments.length - 1] == 'function') {
    this.on('listening', arguments[arguments.length - 1]);
  }

  if (this.server) {
    throw new Error("Already running");
  }

  if (typeof port == 'object') {
    this.server = new WebSocketServer({ server: port }, listening);
  }
  else {
    this.server = new WebSocketServer({ port: port, host: host }, listening);
  }

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

WSProxy.prototype.close = function () {
  if (!this.server) {
    throw new Error("Not running");
  }

  this.server.close();
  this.server = null;
};

