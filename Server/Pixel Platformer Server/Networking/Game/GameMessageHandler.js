const {MessageReader} = require("../../Utility/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Game.Messages;

class GameMessageHandler {
    static RouterMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {

        }
    }
}

exports.GameMessageHandler = GameMessageHandler;