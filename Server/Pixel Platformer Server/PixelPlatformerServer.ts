import {NetworkHandler} from "./Networking/NetworkHandler";

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
    NetworkHandler.SetHandleConnectCallback(this.playerConnected);
      NetworkHandler.SetHandleDisconnectCallback(this.playerDiconnected);
    this.gameLogic = new GameLogic(this);
    this.chatLogic = new ChatLogic(this);
    this.accountLogic = new AccountLogic(this);
  }
  playerConnected = async (player) => {
    this.gameLogic.playerConnected(player).then();
    this.chatLogic.playerConnected(player).then();
    this.accountLogic.playerConnected(player).then();
  };
  playerDiconnected = async (player) => {
    this.gameLogic.playerDisconnected(player).then();
    this.chatLogic.playerDisconnected(player).then();
    this.accountLogic.playerDisconnected(player).then();
  };
}