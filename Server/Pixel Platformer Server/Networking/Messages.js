const {MessageWriter} = require("../Utility/MessageWriter.js");
const Controllers = require("./ClientMessageDefinitions.js");

class Message {
  static LoginSuccess(success) {
    let message = new MessageWriter();
    message.addInt8(Controllers.Login.ID);
    message.addInt8(Controllers.Login.Messages.LoginSuccess);
    message.addInt8(success?1:0);
    return message;
  }
  static RegisterSuccess(success) {
    let message = new MessageWriter();
    message.addInt8(Controllers.Register.ID);
    message.addInt8(Controllers.Register.Messages.RegisterSuccess);
    message.addInt8(success?1:0);
    return message;
  }
}

exports.Message = Message;