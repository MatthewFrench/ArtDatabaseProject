const {MessageReader} = require("../../Utility/MessageReader");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions").Controllers.Game.Messages;

export class GameMessageHandler {
    static RouterMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {

        }
    }
}