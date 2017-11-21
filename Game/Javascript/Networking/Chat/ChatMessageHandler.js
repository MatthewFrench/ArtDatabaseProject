const {MessageReader} = require("../../Utility/Message/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Chat.Messages;

let AddChatMessageListeners = [];

export class ChatMessageHandler {
    static RouteMessage(message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.AddChatMessage: {
                ChatMessageHandler.AddChatMessage(message);
            } break;
        }
    }

    static AddChatMessage(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardID = message.getUint32();
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let playerID = message.getUint32();
        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let chatPrefix = message.getString();
        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let chatMessage = message.getString();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let time = message.getDouble();
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of AddChatMessageListeners) {
            callback(boardID, playerID, chatPrefix, chatMessage, time).then();
        }
    }

    static AddChatMessageListener(callback) {
        AddChatMessageListeners.push(callback);
    }
}