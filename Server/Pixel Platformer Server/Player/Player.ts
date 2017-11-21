import {PlayerAccountData} from "./PlayerAccountData";
import {PlayerGameData} from "./PlayerGameData";

export class Player {
    private socket: any;
    private accountData: any;
    private gameData: any;
    constructor(socket) {
        this.socket = socket;
        this.accountData = new PlayerAccountData();
        this.gameData = new PlayerGameData();
    }
    send(binary) {
        this.socket.send(binary);
    }
    getSocket() {
        return this.socket;
    }
    getAccountData() : PlayerAccountData {
        return this.accountData;
    }
    getGameData() : PlayerGameData {
        return this.gameData;
    }
}