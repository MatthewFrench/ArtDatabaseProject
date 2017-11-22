import {MessageWriter} from "../../Utility/Message/MessageWriter.js";
const GameID = require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Game.ID;
const Messages = require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Game.Messages;

export class GameMessageCreator {
    static NewWorldMessage(worldName) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.CreateNewWorld);
        message.addString(worldName);
        return message.toBuffer();
    }
}