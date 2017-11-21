

export class PlayerGameData {
    private currentBoardID = -1;
    private locationX = 0;
    private locationY = 0;
    constructor() {

    }
    getCurrentBoardID = () => {
        return this.currentBoardID;
    };
    setCurrentBoardID = (boardID) => {
        this.currentBoardID = boardID;
    };
}