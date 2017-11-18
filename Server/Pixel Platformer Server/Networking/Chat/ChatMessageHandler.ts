const {MessageReader} = require("../../Utility/MessageReader");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions").Controllers.Chat.Messages;

export class ChatMessageHandler {
    static RouterMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {

        }
    }
}