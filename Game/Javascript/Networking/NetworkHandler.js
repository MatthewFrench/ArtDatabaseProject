import {Network} from "./Network";

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
            case Controllers.Account.ID: {
                AccountMessageHandler.RouteMessage(message);
            } break;
            case Controllers.Chat.ID: {
                ChatMessageHandler.RouteMessage(message);
            } break;
            case Controllers.Game.ID: {
                GameMessageHandler.RouteMessage(message);
            } break;
            case Controllers.Network.ID: {
                NetworkHandler.HandleNetworkMessages(message);
                break;
            }
            default: {
                console.error('Unknown Message');
                console.trace();
            }
        }
    }

    static HandleNetworkMessages(message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Controllers.Network.Messages.CombinedMessage: {
                while (message.hasBinary()) {
                    try {
                        NetworkHandler.HandleMessage(message.getBinary());
                    } catch (e) {
                        console.log(e);
                        console.error('Badly written combined message.');
                        console.trace();
                    }
                }
                if (!message.isAtEndOfData()) {
                    console.error('Invalid Message');
                    console.trace();
                }
            } break;
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