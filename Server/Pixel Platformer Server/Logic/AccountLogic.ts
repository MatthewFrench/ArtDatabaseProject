import {AccountMessageCreator as MsgCreator} from "../Networking/Account/AccountMessageCreator";
const MsgHandler = require("./../Networking/Account/AccountMessageHandler").AccountMessageHandler;
import {Query} from "../Database/Query";

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
    

    handleTryLoginMessage = async (player, username, password) => {

        let userInfo = await Query.UserLogin(username, password).then();
        if (userInfo === null) {
            //Send login failed
            player.send(MsgCreator.LoginStatus(false));
        } else {
            //Send login success
            player.send(MsgCreator.LoginStatus(true));

            //Store player information in player
            console.dir(userInfo);
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