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

    playerConnected = (player) => {
    };
    playerDiconnected = (player) => {
    };

    handleTryLoginMessage = (player, username, password) => {
        Query.UserLogin(username, password).then((userInfo)=>{
            if (userInfo === null) {
                //Send login failed
                MsgCreator.LoginSuccess(false);
            } else {
                //Send login success
                MsgCreator.LoginSuccess(true);
            }
        });
    };

    handleTryCreateAccountMessage = (player, username, password, email, displayName) => {
        Query.CreateAccount(displayName, username, password, email).then((success) => {
            if (!success) {
                //Send register failed
                MsgCreator.RegisterSuccess(false);
            } else {
                //Send register failed
                MsgCreator.RegisterSuccess(true);
            }
        });
    };
}