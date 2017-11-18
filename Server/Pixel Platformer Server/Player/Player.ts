const {PlayerAccountData} = require("./PlayerAccountData");
const {PlayerGameData} = require("./PlayerGameData");

export class Player {
    socket: any;
    accountData: any;
    gameData: any;
    constructor(socket) {
        this.socket = socket;
        this.accountData = new PlayerAccountData();
        this.gameData = new PlayerGameData();
    }
    getSocket() {
        return this.socket;
    }
    getAccountData() {
        return this.accountData;
    }
    getGameData() {
        return this.gameData;
    }
}