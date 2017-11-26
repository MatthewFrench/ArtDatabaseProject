import {NetworkHandler} from "./Networking/NetworkHandler";

const {Query} = require("./Database/Query");
const {Configuration} = require("./Configuration");
import {GameLogic} from "./Logic/GameLogic";
import {AccountLogic} from "./Logic/AccountLogic";
import {ChatLogic} from "./Logic/ChatLogic";
import {Network} from "./Networking/Network";

export class PixelPlatformerServer {
  gameLogic: GameLogic;
  chatLogic: ChatLogic;
  accountLogic: AccountLogic;
  constructor() {
    Configuration.Initialize(); //Load the config file
    Query.Initialize();
    Network.Initialize();
    NetworkHandler.SetHandleConnectCallback(this.playerConnected);
      NetworkHandler.SetHandleDisconnectCallback(this.playerDiconnected);
    this.gameLogic = new GameLogic(this);
    this.chatLogic = new ChatLogic(this);
    this.accountLogic = new AccountLogic(this);
  }
  playerConnected = async (player) => {
    this.chatLogic.playerConnected(player).then();
    this.accountLogic.playerConnected(player).then();
  };
  playerDiconnected = async (player) => {
    this.gameLogic.playerDisconnected(player).then();
    this.chatLogic.playerDisconnected(player).then();
    this.accountLogic.playerDisconnected(player).then();
  };
}