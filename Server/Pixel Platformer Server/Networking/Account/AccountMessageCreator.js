const {MessageWriter} = require("../../Utility/MessageWriter.js");
const AccountID = require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Account.ID;
const Messages = require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Account.Messages;

class AccountMessageCreator {
  static LoginSuccess(success) {
    let message = new MessageWriter();
    message.addUint8(AccountID);
    message.addUint8(Messages.LoginSuccess);
    message.addInt8(success?1:0);
    return message;
  }
  static RegisterSuccess(success) {
    let message = new MessageWriter();
    message.addUint8(AccountID);
    message.addUint8(Messages.RegisterSuccess);
    message.addInt8(success?1:0);
    return message;
  }
}

exports.AccountMessageCreator = AccountMessageCreator;