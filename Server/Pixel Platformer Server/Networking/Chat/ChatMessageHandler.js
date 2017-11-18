const {MessageReader} = require("../../Utility/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Chat.Messages;

class ChatMessageHandler {
    static RouterMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {

        }
    }
}

exports.ChatMessageHandler = ChatMessageHandler;