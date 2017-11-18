const MsgHandler = require("./../Networking/Account/AccountMessageHandler").AccountMessageHandler;

export class AccountLogic {
    server: any;

    constructor(server) {
        this.server = server;
        MsgHandler.AddTryLoginListener(this.handleTryLoginMessage);
        MsgHandler.AddTryCreateAccountListener(this.handleTryCreateAccountMessage);
    }

    handleTryLoginMessage = (player, username, password) => {
        console.log('Got try login logic');
    };

    handleTryCreateAccountMessage = (player, username, password, email, displayName) => {

    };
}