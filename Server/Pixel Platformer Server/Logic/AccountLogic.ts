import {AccountMessageCreator as MsgCreator} from "../Networking/Account/AccountMessageCreator";
const MsgHandler = require("./../Networking/Account/AccountMessageHandler").AccountMessageHandler;
import {Query} from "../Database/Query";
import {Player} from "../Player/Player";
import {PixelPlatformerServer} from "../PixelPlatformerServer";

export class AccountLogic {
    server: PixelPlatformerServer;

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

            this.server.gameLogic.playerLoggedIn(player);
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