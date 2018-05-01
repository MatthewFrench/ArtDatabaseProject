const {MessageReader} = require("../../Utility/MessageReader");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions").Controllers.Account.Messages;
import {Player} from "../../Player/Player";

//All listeners must be promises(async)
let TryLoginListeners :
    ((player: Player, username: string, password: string)
        =>Promise<void>)[] = [];
let TryCreateAccountListeners :
    ((player: Player, username, password, email, displayName)
        =>Promise<void>)[] = [];

export class AccountMessageHandler {
    static RouteMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.TryCreateAccount: {
                AccountMessageHandler.TryCreateAccount(player, message);
            } break;
            case Messages.TryLogin: {
                AccountMessageHandler.TryLogin(player, message);
            } break;
        }
    }

    static TryLogin(player, message) {
        //Parse message with validation
        if (!message.hasString()) {
            console.log('Invalid Try Login Message');
            return;
        }
        let username = message.getString();
        if (!message.hasString()) {
            console.log('Invalid Try Login Message');
            return;
        }
        let password = message.getString();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Login Message');
            return;
        }
        //Send to all listeners
        for (let callback of TryLoginListeners) {
            callback(player, username, password).then();
        }
    }

    static TryCreateAccount(player, message) {
        //Parse message
        if (!message.hasString()) {
            console.log('Invalid Try Create Account Message');
            return;
        }
        let username = message.getString();
        if (!message.hasString()) {
            console.log('Invalid Try Create Account Message');
            return;
        }
        let password = message.getString();
        if (!message.hasString()) {
            console.log('Invalid Try Create Account Message');
            return;
        }
        let email = message.getString();
        if (!message.hasString()) {
            console.log('Invalid Try Create Account Message');
            return;
        }
        let displayName = message.getString();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create Account Message');
            return;
        }
        //Send to all listeners
        for (let callback of TryCreateAccountListeners) {
            callback(player, username, password, email, displayName).then();
        }
    }

    static AddTryLoginListener(callback) {
        TryLoginListeners.push(callback);
    }
    static AddTryCreateAccountListener(callback) {
        TryCreateAccountListeners.push(callback);
    }
}