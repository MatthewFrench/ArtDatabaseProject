//Socket.io code goes here, managed here
const {NetworkHandler} = require("./NetworkHandler");
const { readFileSync } = require("fs");
const { createSecureServer } = require("http2");
const Server = require("socket.io");

let port = 7777;
let server = null;

export class Network {
    static Initialize() {
        const httpServer = createSecureServer({
            allowHTTP1: true,
            // Note: This is hardcoded now for speed. This should be configurable and passed in from docker.
            // Dev server should not use SSL since it will be blocked.
            key: readFileSync("/certs/privkey.pem"),
            cert: readFileSync("/certs/fullchain.pem")
        });

        server = Server(httpServer, {pingInterval: 5000});

        server.on('connection', function (socket) {
            Network.ClientConnected(socket);
            socket.on('message', function (binary) {
                Network.ClientMessage(socket, binary);
            });
            socket.on('disconnect', function () {
                Network.ClientDisconnected(socket);
            });
        });
        httpServer.listen(port);
        console.log(`Websocket server is online at ${port}!`);
    }

    static ClientConnected(socket) {
        NetworkHandler.HandleConnect(socket);
    }

    static ClientMessage(socket, binary) {
        if (binary instanceof Buffer === false) {
            console.error('Invalid Message Type Not Binary');
            console.trace();
            return;
        }
        NetworkHandler.HandleMessage(socket, binary);
    }

    static ClientDisconnected(socket) {
        NetworkHandler.HandleDisconnect(socket);
    }
}