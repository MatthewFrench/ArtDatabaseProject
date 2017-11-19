const {MessageReader} = require("../Utility/Message/MessageReader.js");
const {Controllers} = require("./MessageDefinitions/ClientMessageDefinitions.js");
const {AccountMessageHandler} = require("./Account/AccountMessageHandler.js");
const {GameMessageHandler} = require("./Game/GameMessageHandler.js");
const {ChatMessageHandler} = require("./Chat/ChatMessageHandler.js");

let HandleConnectCallback;
let HandleDisconnectCallback;
let HandleConnectFailedCallback;
/**
 * Routes the messages to controllers.
 */
export class NetworkHandler {
    static HandleMessage(binary) {
        let message = new MessageReader(binary);
        //Get the controller
        let controllerID = message.getUint8();
        //Send it to the correct callbacks
        switch(controllerID) {
            case Controllers.Account: {
                AccountMessageHandler.RouteMessage(message);
            } break;
            case Controllers.Chat: {
                ChatMessageHandler.RouteMessage(message);
            } break;
            case Controllers.Game: {
                GameMessageHandler.RouteMessage(message);
            } break;
            default: {
                console.error('Unknown Message');
            }
        }
    }

    static HandleConnectFailed() {
        HandleConnectFailedCallback().then();
    }

    static HandleConnect() {
        HandleConnectCallback().then();
    }

    static HandleDisconnect() {
        HandleDisconnectCallback().then();
    }

    static SetHandleConnectFailedCallback(callback) {
        HandleConnectFailedCallback = callback;
    }
    static SetHandleConnectCallback(callback) {
        HandleConnectCallback = callback;
    }
    static SetHandleDisconnectCallback(callback) {
        HandleDisconnectCallback = callback;
    }
}