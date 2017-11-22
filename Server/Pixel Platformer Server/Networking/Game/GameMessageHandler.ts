const {MessageReader} = require("../../Utility/MessageReader");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions").Controllers.Game.Messages;
import {Player} from "../../Player/Player";

//All listeners must be promises(async)
let CreateWorldListeners :
    ((player: Player, worldName: string) =>Promise<void>)[] = [];

export class GameMessageHandler {
    static RouteMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.CreateNewWorld: {
                GameMessageHandler.CreateWorldMessage(player, message);
            } break;
        }
    }

    static CreateWorldMessage(player, message) {
        //Parse message with validation
        if (!message.hasString()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let worldName = message.getString();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of CreateWorldListeners) {
            callback(player, worldName).then();
        }
    }

    static AddNewCreateWorldListener(callback) {
        CreateWorldListeners.push(callback);
    }
}