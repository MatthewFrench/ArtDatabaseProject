const {MessageReader} = require("../../Utility/Message/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Account.Messages;

//All listeners must be promises(async)
let LoginStatusListeners = [];
let RegisterStatusListeners = [];

export class AccountMessageHandler {
    static RouteMessage(message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.RegisterStatus: {
                AccountMessageHandler.RegisterStatus(message);
            } break;
            case Messages.LoginStatus: {
                AccountMessageHandler.LoginStatus(message);
            } break;
        }
    }

    static LoginStatus(message) {
        //Parse message with validation
        if (!message.hasUint8()) {
            console.error('Invalid Message');
            return;
        }
        let success = message.getUint8() === 1;
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            return;
        }
        //Send to all listeners
        for (let callback of LoginStatusListeners) {
            callback(success).then();
        }
    }

    static RegisterStatus(message) {
        //Parse message
        if (!message.hasUint8()) {
            console.error('Invalid Message');
            return;
        }
        let success = message.getUint8() === 1;
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            return;
        }
        //Send to all listeners
        for (let callback of RegisterStatusListeners) {
            callback(success).then();
        }
    }

    static AddLoginStatusListener(callback) {
        LoginStatusListeners.push(callback);
    }
    static AddRegisterStatusListener(callback) {
        RegisterStatusListeners.push(callback);
    }
}