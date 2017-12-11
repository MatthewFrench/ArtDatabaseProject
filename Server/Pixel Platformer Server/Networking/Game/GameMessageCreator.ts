import {Player} from "../../Player/Player";
import {Tile} from "../../Logic/Game/Tile/Tile";

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

    //Switch to board, message sent to player telling player to be in board
    static SwitchToBoard = (boardID) => {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.SwitchToBoard);
        message.addUint32(boardID);
        return message.toBuffer();
    };
    //Add player message, tells client the player in the board
    static AddPlayer = (player: Player) => {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.AddPlayer);
        message.addUint32(player.getAccountData().getPlayerID());
        message.addUint32(player.getAccountData().getSpriteID());
        message.addString(player.getAccountData().getDisplayName());
        message.addDouble(player.getGameData().getX());
        message.addDouble(player.getGameData().getY());
        message.addDouble(player.getGameData().getSpeedX());
        message.addDouble(player.getGameData().getSpeedY());
        message.addUint8(player.getGameData().getMovingLeft());
        message.addUint8(player.getGameData().getMovingRight());
        message.addUint8(player.getGameData().getJumping());
        return message.toBuffer();
    };
    //Remove player message,
    static RemovePlayer = (player: Player) => {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.RemovePlayer);
        message.addUint32(player.getAccountData().getPlayerID());
        return message.toBuffer();
    };
    //Update player message
    static UpdatePlayer = (player: Player) => {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.UpdatePlayer);
        message.addUint32(player.getAccountData().getPlayerID());
        message.addUint32(player.getAccountData().getSpriteID());
        message.addDouble(player.getGameData().getX());
        message.addDouble(player.getGameData().getY());
        message.addDouble(player.getGameData().getSpeedX());
        message.addDouble(player.getGameData().getSpeedY());
        message.addUint8(player.getGameData().getMovingLeft()?1:0);
        message.addUint8(player.getGameData().getMovingRight()?1:0);
        message.addUint8(player.getGameData().getJumping()?1:0);
        return message.toBuffer();
    };
    //Update tile message
    static UpdateTile = (tile: Tile) => {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.UpdateTile);
        message.addInt32(tile.getX());
        message.addInt32(tile.getY());
        message.addUint16(tile.getTypeID());
        message.addUint8(tile.getR());
        message.addUint8(tile.getG());
        message.addUint8(tile.getB());
        message.addUint8(tile.getA());
        return message.toBuffer();
    };
    //The tells the client to focus on this ID, likely self
    static FocusPlayer = (player: Player) => {
        let message = new MessageWriter();
        message.addUint8(GameID);
        message.addUint8(Messages.FocusPlayerID);
        message.addInt32(player.getAccountData().getPlayerID());
        return message.toBuffer();
    };
}