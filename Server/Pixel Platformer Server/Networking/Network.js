//Socket.io code goes here, managed here

let socketIO = require('socket.io');
let port = 7777;
let server = null;

class Network {
  static Initialize() {
    server = socketIO(port);
    console.log(`Websocket server is online at ${port}!`);

    server.on('connection', function (socket) {
      Network.ClientConnected(socket);
      socket.on('message', function (message) {
        Network.ClientMessage(socket, message);
      });
      socket.on('disconnect', function () {
        Network.ClientDisconnected(socket);
      });
    });
  }
  static ClientConnected(socket) {
    //Client connected
    console.log('Client Connected!');
    console.log(`${Object.keys(server.sockets.connected).length} clients connected.`);
  }
  static ClientMessage(socket, message) {
    console.log('Got message from client!');
  }
  static ClientDisconnected(socket) {
    console.log('Client Disconnected!');
  }
}

exports.Network = Network;