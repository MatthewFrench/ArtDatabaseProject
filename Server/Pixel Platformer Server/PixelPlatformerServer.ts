const {Query} = require("./Database/Query");
const {Configuration} = require("./Configuration");
const {Network} = require("./Networking/Network");
const {GameLogic} = require("./Logic/GameLogic");
const {ChatLogic} = require("./Logic/ChatLogic");
const {AccountLogic} = require("./Logic/AccountLogic");

export class PixelPlatformerServer {
  gameLogic: any;
  chatLogic: any;
  accountLogic: any;
  constructor() {
    Configuration.Initialize(); //Load the config file
    Query.Initialize();
    Network.Initialize();
    this.gameLogic = new GameLogic(this);
    this.chatLogic = new ChatLogic(this);
    this.accountLogic = new AccountLogic(this);
  }
}