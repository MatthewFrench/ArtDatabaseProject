//Socket.io code goes here, managed here

let socketIO = require('socket.io');
let server = null;

class Network {
  static Initialize() {
    server = socketIO(7777);
    console.log('Websocket server is online!');

    server.on('connection', function (socket) {
      Network.ClientConnected(socket);
      socket.on('message', function () {
        Network.ClientMessage(socket);
      });
      socket.on('disconnect', function () {
        Network.ClientDisconnected(socket);
      });
    });
  }
  static ClientConnected(socket) {
    //Client connected
    console.log('Client Connected!');
  }
  static ClientMessage(socket) {
    console.log('Got message from client!');
  }
  static ClientDisconnected(socket) {
    console.log('Client Disconnected!');
  }
}

exports.Network = Network;