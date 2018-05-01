const {MessageReader} = require("../../Utility/MessageReader");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions").Controllers.Chat.Messages;
import {Player} from "../../Player/Player";

//All listeners must be promises(async)
let NewChatMessageListeners :
    ((player: Player, chatMessage: string) =>Promise<void>)[] = [];

export class ChatMessageHandler {
    static RouteMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.NewChatMessage: {
                ChatMessageHandler.NewChatMessage(player, message);
            } break;
        }
    }

    static NewChatMessage(player, message) {
        //Parse message with validation
        if (!message.hasString()) {
            console.log('Invalid Try Login Message');
            return;
        }
        let chatMessage = message.getString();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Login Message');
            return;
        }
        //Send to all listeners
        for (let callback of NewChatMessageListeners) {
            callback(player, chatMessage).then();
        }
    }

    static AddNewChatMessageListener(callback) {
        NewChatMessageListeners.push(callback);
    }
}