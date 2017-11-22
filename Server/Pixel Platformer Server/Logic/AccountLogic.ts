import {AccountMessageCreator as MsgCreator} from "../Networking/Account/AccountMessageCreator";
const MsgHandler = require("./../Networking/Account/AccountMessageHandler").AccountMessageHandler;
import {Query} from "../Database/Query";
import {Player} from "../Player/Player";
import {NetworkHandler} from "../Networking/NetworkHandler";
import {GameMessageCreator} from "../Networking/Game/GameMessageCreator";

export class AccountLogic {
    server: any;

    constructor(server) {
        this.server = server;
        MsgHandler.AddTryLoginListener(this.handleTryLoginMessage);
        MsgHandler.AddTryCreateAccountListener(this.handleTryCreateAccountMessage);
    }

    playerConnected = async (player) => {

    };

    playerDisconnected = async (player) => {

    };
    

    handleTryLoginMessage = async (player : Player, username, password) => {

        let userInfo = await Query.UserLogin(username, password).then();
        if (userInfo === null) {
            //Send login failed
            player.send(MsgCreator.LoginStatus(false));
        } else {
            //Store player information in player
            let playerID = userInfo['player_id'];
            let spriteID = userInfo['sprite_id'];
            let username = userInfo['username'];
            let email = userInfo['email'];
            let display_name = userInfo['display_name'];
            let playerAccountData = player.getAccountData();
            playerAccountData.setDisplayName(display_name);
            playerAccountData.setIsLoggedIn(true);
            playerAccountData.setUsername(username);
            playerAccountData.setEmail(email);
            playerAccountData.setSpriteID(spriteID);
            playerAccountData.setPlayerID(playerID);

            //Send login success
            player.send(MsgCreator.LoginStatus(true));

            //Send all boards
            let boards = await Query.GetAllBoards();
            for (let board of boards) {
                let boardName = board['name'];
                let boardID = board['board_id'];
                NetworkHandler.SendToAllLoggedIn(
                    GameMessageCreator.UpdateSelectorBoard(boardID,
                        boardName, 0, new Date(),
                        0));
            }
        }
    };

    handleTryCreateAccountMessage = async (player, username, password, email, displayName) => {
        let success = await Query.CreateAccount(displayName, username, password, email);
        if (!success) {
            //Send register failed
            player.send(MsgCreator.RegisterStatus(false));
        } else {
            //Send register failed
            player.send(MsgCreator.RegisterStatus(true));
        }
    };
}