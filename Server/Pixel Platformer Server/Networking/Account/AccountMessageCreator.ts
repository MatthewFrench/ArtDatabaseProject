const {MessageWriter} = require("../../Utility/MessageWriter");
const AccountID = require("./../MessageDefinitions/ClientMessageDefinitions").Controllers.Account.ID;
const Messages = require("./../MessageDefinitions/ClientMessageDefinitions").Controllers.Account.Messages;

export class AccountMessageCreator {
  static LoginStatus(success) {
    let message = new MessageWriter();
    message.addUint8(AccountID);
    message.addUint8(Messages.LoginStatus);
    message.addInt8(success?1:0);
    return message.toBuffer();
  }
  static RegisterStatus(success) {
    let message = new MessageWriter();
    message.addUint8(AccountID);
    message.addUint8(Messages.RegisterStatus);
    message.addInt8(success?1:0);
    return message.toBuffer();
  }
}