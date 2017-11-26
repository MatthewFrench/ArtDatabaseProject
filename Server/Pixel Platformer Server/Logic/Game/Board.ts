import {Player} from "../../Player/Player";

export class Board {
    boardID : number;
    players : Player[];

    constructor() {

    }

    loadTilesFromDatabase = () => {

    };

    getBoardID = () : number => {
        return this.boardID;
    }
}