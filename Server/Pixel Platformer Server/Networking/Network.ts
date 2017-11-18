//Socket.io code goes here, managed here
const {NetworkHandler} = require("./NetworkHandler");

let socketIO = require('socket.io');
let port = 7777;
let server = null;

export class Network {
  static Initialize() {
    server = socketIO(port);
    console.log(`Websocket server is online at ${port}!`);

    server.on('connection', function (socket) {
      Network.ClientConnected(socket);
      socket.on('message', function (binary) {
        Network.ClientMessage(socket, binary);
      });
      socket.on('disconnect', function () {
        Network.ClientDisconnected(socket);
      });
    });
  }
  static ClientConnected(socket) {
    NetworkHandler.HandleConnect(socket);
  }
  static ClientMessage(socket, binary) {
    NetworkHandler.HandleMessage(socket, binary);
  }
  static ClientDisconnected(socket) {
    NetworkHandler.HandleDisconnect(socket);
  }
}