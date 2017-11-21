const {MessageReader} = require("../../Utility/Message/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Game.Messages;

export class GameMessageHandler {
    static RouteMessage(message) {
        let messageID = message.getUint8();
        switch(messageID) {

        }
    }
}