const {MessageWriter} = require("../../Utility/MessageWriter");
const ChatID = require("./../MessageDefinitions/ClientMessageDefinitions").Controllers.Chat.ID;
const Messages = require("./../MessageDefinitions/ClientMessageDefinitions").Controllers.Chat.Messages;

export class ChatMessageCreator {
    static AddChatMessage(boardID : number,
                          playerID : number,
                          messagePrefix : string,
                          chatMessage : string,
                          time : Date) {
        let message = new MessageWriter();
        message.addUint8(ChatID);
        message.addUint8(Messages.AddChatMessage);
        message.addUint32(boardID);
        message.addUint32(playerID);
        message.addString(messagePrefix);
        message.addString(chatMessage);
        message.addDouble(time.getTime());
        return message.toBuffer();
    }
}