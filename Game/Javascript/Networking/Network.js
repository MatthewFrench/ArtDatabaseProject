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
  }

  static SendMessage(message) {
    connection.send(message);
  }
}