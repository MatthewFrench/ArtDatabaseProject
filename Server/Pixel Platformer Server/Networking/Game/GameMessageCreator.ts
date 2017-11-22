const {MessageWriter} = require("../../Utility/MessageWriter");
const GameID = require("./../MessageDefinitions/ClientMessageDefinitions").Controllers.Game.ID;
const Messages = require("./../MessageDefinitions/ClientMessageDefinitions").Controllers.Game.Messages;

export class GameMessageCreator {
    //Sends an update to the board selector
    static UpdateSelectorBoard(boardID : number,
                          boardName : string,
                          numberInBoard : number,
                          lastModified : Date,
                          tileCount : number) : Buffer {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.UpdateSelectorBoard);
        message.addUint32(boardID);
        message.addString(boardName);
        message.addDouble(numberInBoard);
        message.addDouble(lastModified.getTime());
        message.addDouble(tileCount);
        return message.toBuffer();
    }
}