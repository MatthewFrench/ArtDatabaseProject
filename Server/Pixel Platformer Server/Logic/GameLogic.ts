import {Player} from "../Player/Player";
import {GameMessageCreator, GameMessageCreator as MsgCreator} from "../Networking/Game/GameMessageCreator";
import {MessageWriter} from "../Utility/MessageWriter";
import {Utility} from "../Utility/Utility";
import {NetworkHandler} from "../Networking/NetworkHandler";
import {Query} from "../Database/Query";
const MsgHandler = require("./../Networking/Game/GameMessageHandler").GameMessageHandler;

export class GameLogic {
    server: any;
    constructor(server) {
        this.server = server;
        MsgHandler.AddNewCreateWorldListener(this.handleNewCreateWorldMessage);
    }
    playerConnected = async (player) => {
    };
    playerDisconnected = async (player) => {
    };
    handleNewCreateWorldMessage = async(player: Player, worldName: string) => {
        let boardID = await Query.CreateBoard(worldName, player.getAccountData().getPlayerID());
        let boardInfo = await Query.GetBoardByID(boardID);
        let boardName = boardInfo['name'];
        NetworkHandler.SendToAllLoggedIn(
            GameMessageCreator.UpdateSelectorBoard(boardID,
                boardName, 0, new Date(),
                0));
    };
}