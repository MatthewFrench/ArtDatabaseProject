const {MessageReader} = require("../Utility/Message/MessageReader.js");
const {MessageWriter} = require("../Utility/Message/MessageWriter.js");
const {NetworkHandler} = require("./NetworkHandler.js");
let Buffer = require('buffer/').Buffer;

let socketIO = require('socket.io-client');
let port = '7777';
//let ip = 'localhost';
let ip = '38.44.161.81';
let server = `http://${ip}:${port}`;
let connection = null;
let connected = false;
let pingTime = 0;
let pingTimeArray = [];

export class Network {
    static Initialize() {
        connection = socketIO.connect(server);
        connection.on('connect_failed', Network.ConnectFailed);
        connection.on('connect', Network.Connected);
        connection.on('message', Network.GotMessage);
        connection.on('disconnect', Network.Disconnected);

        connection.on('pong', function(ms) {
            pingTime = ms;
            pingTimeArray.push(pingTime);
            if (pingTimeArray.length > 3) {
                pingTimeArray.shift();
            }
        });
    }

    static ConnectFailed() {
        NetworkHandler.HandleConnectFailed();
        console.log('Failed to connect to server.');
    }

    static Connected() {
        connected = true;
        NetworkHandler.HandleConnect();
        console.log('Client has connected to the server!');
    }

    static Disconnected() {
        connected = false;
        NetworkHandler.HandleDisconnect();
        console.log('The client has disconnected!');
    }

    static IsConnected() {
        return connected;
    }

    static GetPing() {
        if (pingTimeArray.length === 0) {
            return pingTime;
        }
        let average = 0;
        for (let ping of pingTimeArray) {
            average += ping;
        }
        average = average / pingTimeArray.length;
        return (pingTime + average) / 2.0;
    }

    static GotMessage(message) {
        if (message instanceof ArrayBuffer === false) {
            console.error('Invalid Message Type Not Binary');
            console.trace();
            return;
        }
        NetworkHandler.HandleMessage(message);
    }

    static Send(message) {
        connection.send(message);
    }
}