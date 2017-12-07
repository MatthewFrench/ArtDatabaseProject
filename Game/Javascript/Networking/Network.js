const {MessageReader} = require("../Utility/Message/MessageReader.js");
const {MessageWriter} = require("../Utility/Message/MessageWriter.js");
const {NetworkHandler} = require("./NetworkHandler.js");
let Buffer = require('buffer/').Buffer;

let socketIO = require('socket.io-client');
let port = '7777';
let ip = 'localhost';
//let ip = '18.221.216.221';
let server = `http://${ip}:${port}`;
let connection = null;
let connected = false;
let pingTime = 0;
let totalPing = 0;
let pingCount = 0;

export class Network {
    static Initialize() {
        connection = socketIO.connect(server);
        connection.on('connect_failed', Network.ConnectFailed);
        connection.on('connect', Network.Connected);
        connection.on('message', Network.GotMessage);
        connection.on('disconnect', Network.Disconnected);

        connection.on('pong', function(ms) {
            if (pingCount > 10) {
                pingCount = 0;
                totalPing = 0;
            }
            pingTime = ms;
            pingCount++;
            totalPing += pingTime;
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
        if (pingCount === 0) {
            return pingTime;
        }
        return Math.max(pingTime, totalPing/pingCount);
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