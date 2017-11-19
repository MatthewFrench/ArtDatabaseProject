const {MessageWriter} = require("../../Utility/Message/MessageWriter.js");
const AccountID = require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Account.ID;
const Messages = require("./../MessageDefinitions/ServerMessageDefinitions.js").Controllers.Account.Messages;

export class AccountMessageCreator {
  static Login(username, password) {
    let message = new MessageWriter();
    message.addUint8(AccountID);
    message.addUint8(Messages.TryLogin);
    message.addString(username);
    message.addString(password);
    return message;
  }
  static Register(username, password, email, displayName) {
    let message = new MessageWriter();
    message.addUint8(AccountID);
    message.addUint8(Messages.TryCreateAccount);
    message.addString(username);
    message.addString(password);
    message.addString(email);
    message.addString(displayName);
    return message;
  }
}