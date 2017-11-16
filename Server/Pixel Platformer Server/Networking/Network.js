//Socket.io code goes here, managed here
const {MessageReader} = require("../Utility/MessageReader.js");
const {MessageWriter} = require("../Utility/MessageWriter.js");

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

    let testMessage = new MessageWriter();
    testMessage.addInt32(8);
    testMessage.addString('Test String');
    socket.send(testMessage.toBuffer());
  }
  static ClientMessage(socket, message) {
    console.log('Got message from client!');

    console.log('Received a message from the client!', message);
    console.dir(message);
    let testMessage = new MessageReader(Buffer.from(message));
    console.log('Test message: ');
    console.dir(testMessage);
    console.log('Number: ' + testMessage.getInt32());
    console.log('String: ' + testMessage.getString());
  }
  static ClientDisconnected(socket) {
    console.log('Client Disconnected!');
  }
}

exports.Network = Network;