const {PlayerAccountData} = require("./PlayerAccountData.js");
const {PlayerGameData} = require("./PlayerGameData.js");

class Player {
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

exports = Player;