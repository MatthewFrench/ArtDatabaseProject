const {Query} = require("./Database/Query.js");
const {Configuration} = require("./Configuration.js");
const {Network} = require("./Networking/Network.js");
const {GameLogic} = require("./Logic/GameLogic.js");
const {ChatLogic} = require("./Logic/ChatLogic.js");
const {AccountLogic} = require("./Logic/AccountLogic.js");

class PixelPlatformerServer {
  constructor() {
    Configuration.Initialize(); //Load the config file
    Query.Initialize();
    Network.Initialize();
    this.gameLogic = new GameLogic(this);
    this.chatLogic = new ChatLogic(this);
    this.accountLogic = new AccountLogic(this);
  }
}

exports.PixelPlatformerServer = PixelPlatformerServer;