import {MessageWriter} from "../../Utility/Message/MessageWriter";
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

    static RequestBoardSwitch(boardID) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.RequestBoardSwitch);
        message.addUint32(boardID);
        return message.toBuffer();
    }

    static SpriteChange(spriteID) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.SpriteChange);
        message.addUint32(spriteID);
        return message.toBuffer();
    }

    static MovingLeft(moving) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.MovingLeft);
        message.addUint8(moving?1:0);
        return message.toBuffer();
    }

    static MovingRight(moving) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.MovingRight);
        message.addUint8(moving?1:0);
        return message.toBuffer();
    }

    static Jumping(moving) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.Jumping);
        message.addUint8(moving?1:0);
        return message.toBuffer();
    }

    static SetTile(x, y, typeID, r, g, b, a) {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.SetTile);
        message.addInt32(x);
        message.addInt32(y);
        message.addUint16(typeID);
        message.addUint8(r);
        message.addUint8(g);
        message.addUint8(b);
        message.addUint8(a);
        return message.toBuffer();
    }

    static LoadFullWorld() {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.LoadFullWorld);
        return message.toBuffer();
    }
}