const {MessageReader} = require("../Utility/MessageReader");
const {Controllers} = require("./MessageDefinitions/ServerMessageDefinitions");
const {AccountMessageHandler} = require("./Account/AccountMessageHandler");
const {GameMessageHandler} = require("./Game/GameMessageHandler");
const {ChatMessageHandler} = require("./Chat/ChatMessageHandler");
const {Player} = require("../Player/Player");

let HandleConnectCallback = (player)=>{};
let HandleDisconnectCallback = (player)=>{};
let Players = new Map();
/**
 * Routes the messages to controllers.
 */
export class NetworkHandler {
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