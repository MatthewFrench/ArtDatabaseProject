const {MessageReader} = require("../Utility/Message/MessageReader.js");
const {MessageWriter} = require("../Utility/Message/MessageWriter.js");
let Buffer = require('buffer/').Buffer;

let socketIO = require('socket.io-client');
let port = '7777';
let ip = 'localhost';
let server = `http://${ip}:${port}`;
let connection = null;
let connected = false;

export class Network {
  static Initialize() {
    connection = socketIO.connect(server);
    connection.on('connect_failed', Network.ConnectFailed);
    connection.on('connect', Network.Connected);
    connection.on('message', Network.GotMessage);
    connection.on('disconnect', Network.Disconnected);
  }

  static ConnectFailed() {
    console.log('Connection to server failed.');
  }

  static Connected() {
    console.log('Client has connected to the server!');
    connected = true;
  }

  static Disconnected() {
    console.log('The client has disconnected!');
    connected = false;
  }

  static IsConnected() {
    return connected;
  }

  static GotMessage(message) {
    console.log('Received a message from the server!', message);
    console.dir(message);
    let testMessage = new MessageReader(Buffer.from(message));
    console.log('Number: ' + testMessage.getInt32());
    console.log('String: ' + testMessage.getString());

    let backMessage = new MessageWriter();
    backMessage.addInt32(1);
    backMessage.addString('Hi');
    let buffer = backMessage.toBuffer();
    connection.send(buffer.buffer.slice(
      buffer.byteOffset, buffer.byteOffset + buffer.byteLength
    ));
  }

  static SendMessage(message) {
    connection.send(message);
  }
}