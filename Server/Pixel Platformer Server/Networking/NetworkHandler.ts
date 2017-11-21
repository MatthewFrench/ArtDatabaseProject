const {MessageReader} = require("../Utility/MessageReader");
const {Controllers} = require("./MessageDefinitions/ServerMessageDefinitions");
const {AccountMessageHandler} = require("./Account/AccountMessageHandler");
const {GameMessageHandler} = require("./Game/GameMessageHandler");
const {ChatMessageHandler} = require("./Chat/ChatMessageHandler");
import {Player} from "../Player/Player";

let HandleConnectCallback : (player)=>Promise<void>;
let HandleDisconnectCallback : (player)=>Promise<void>;
let Players = new Map<Player, any>();
/**
 * Routes the messages to controllers.
 */
export class NetworkHandler {
    static HandleMessage(socket, binary) {
        let player = Players.get(socket);
        let message = new MessageReader(binary);
        //Get the controller
        let controllerID = message.getUint8();
        let test = Controllers.Account.ID === controllerID;
        //Send it to the correct callbacks
        switch(controllerID) {
            case Controllers.Account.ID: {
                AccountMessageHandler.RouteMessage(player, message);
            } break;
            case Controllers.Chat.ID: {
                ChatMessageHandler.RouteMessage(player, message);
            } break;
            case Controllers.Game.ID: {
                GameMessageHandler.RouteMessage(player, message);
            } break;
            default: {
                console.log('Unknown Message');
            }
        }
    }

    static SendToAll(message: Buffer) {
        Players.forEach((player: Player)=>{
            player.send(message);
        });
    }

    static HandleConnect(socket) {
        let player = new Player(socket);
        Players.set(socket, player);
        HandleConnectCallback(player).then();
        console.log('Player Connected: ' + Players.size);
    }

    static HandleDisconnect(socket) {
        let player = Players.get(socket);
        Players.delete(socket);
        HandleDisconnectCallback(player).then();
        console.log('Player Disconnected: ' + Players.size);
    }

    static SetHandleConnectCallback(callback : (player)=>Promise<void>) {
        HandleConnectCallback = callback;
    }
    static SetHandleDisconnectCallback(callback : (player)=>Promise<void>) {
        HandleDisconnectCallback = callback;
    }
}