const {MessageWriter} = require("../../Utility/Message/MessageWriter.js");
const ChatID = require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Chat.ID;
const Messages = require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Chat.Messages;

export class ChatMessageCreator {
    static NewChatMessage(chatMessage) {
        let message = new MessageWriter();
        message.addUint8(ChatID);
        message.addUint8(Messages.NewChatMessage);
        message.addString(chatMessage);
        return message.toBuffer();
    }
}