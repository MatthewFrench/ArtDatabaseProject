const {MessageReader} = require("../Utility/MessageReader.js");
const {Controllers} = require("./MessageDefinitions/ServerMessageDefinitions.js");
const AccountMessageHandler = require("./Account/AccountMessageHandler.js");
const GameMessageHandler = require("./Game/GameMessageHandler.js");
const ChatMessageHandler = require("./Chat/ChatMessageHandler.js");

let HandleConnectCallback = ()=>{};
let HandleDisconnectCallback = ()=>{};
let Players = new Map();
/**
 * Routes the messages to controllers.
 */
class NetworkHandler {
    static HandleMessage(socket, binary) {
        let player = Players.get(socket);
        let message = new MessageReader(binary);
        //Get the controller
        let controllerID = message.getUint8();
        //Send it to the correct callbacks
        switch(controllerID) {
            case Controllers.Account: {
                AccountMessageHandler.RouterMessage(player, message);
            } break;
            case Controllers.Chat: {
                ChatMessageHandler(player, message);
            } break;
            case Controllers.Game: {
                GameMessageHandler(player, message);
            } break;
            default: {
                console.log('Unknown Message');
            }
        }
    }

    static HandleConnect(socket) {
        let player = new Player(socket);
        Players.set(socket, player);
        HandleConnectCallback(player);
        console.log('Player Connected: ' + Players.size);
    }

    static HandleDisconnect(socket) {
        let player = Players.get(socket);
        Players.delete(socket);
        HandleDisconnectCallback(player);
        console.log('Player Disconnected: ' + Players.size);
    }

    static SetHandleConnectCallback(callback) {
        HandleConnectCallback = callback;
    }
    static SetHandleDisconnectCallback(callback) {
        HandleDisconnectCallback = callback;
    }
}

exports.NetworkHandler = NetworkHandler;