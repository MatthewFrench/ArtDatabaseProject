

export class PlayerGameData {
    currentBoardID = -1;
    locationX = 0;
    locationY = 0;
    constructor() {

    }
    getCurrentBoardID = () => {
        return this.currentBoardID;
    };
    setCurrentBoardID = (boardID) => {
        this.currentBoardID = boardID;
    };
}