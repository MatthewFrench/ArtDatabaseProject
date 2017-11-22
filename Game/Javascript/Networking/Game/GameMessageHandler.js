const {MessageReader} = require("../../Utility/Message/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Game.Messages;

let AddUpdateSelectorBoardListeners = [];

export class GameMessageHandler {
    static RouteMessage(message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.UpdateSelectorBoard: {
                GameMessageHandler.UpdateSelectorBoard(message);
            } break;
        }
    }

    static UpdateSelectorBoard(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardID = message.getUint32();
        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardName = message.getString();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let numberInBoard = message.getDouble();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let lastModified = message.getDouble();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let tileCount = message.getDouble();
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of AddChatMessageListeners) {
            callback(boardID, boardName, numberInBoard, lastModified, tileCount).then();
        }
    }

    static AddUpdateSelectorBoardListener(callback) {
        AddUpdateSelectorBoardListeners.push(callback);
    }
}