import {Interface} from "../../Utility/Interface.js";
import {BoardRow} from "./BoardRow.js";

export class BoardSelector {
    constructor(game) {
        this.game = game;
        this.rows = [];
        this.currentBoardID = -1;
        this.mainDiv = Interface.Create({
            type: 'div', className: 'BoardSelector', elements: [
                {type: 'div', text: 'Create World', className: 'CreateWorld', onClick: this.createWorldClicked},
                this.rowContainer = Interface.Create({type: 'div', className: 'RowContainer'})
            ]
        })
    }

    setCurrentBoardID = (boardID) => {
        this.currentBoardID = boardID;
    };

    boardClicked = (boardID) => {
        this.game.requestSwitchToBoard(boardID);
    };

    updateBoard = (boardName, boardID, numberInBoard, lastModified, tileCount) => {
        let foundRow = this.getRowByBoardID(boardID);
        if(foundRow === null){
            let newRow = new BoardRow(boardName, boardID, numberInBoard, lastModified, tileCount, this.boardClicked);
            this.rows.push(newRow);
            this.rowContainer.appendChild(newRow.getDiv());
        }
        else{
            foundRow.update(boardName, boardID, numberInBoard, lastModified, tileCount);
        }
    };

    sortBoards = () => {
        //Unhighlight all rows
        for (let row of this.rows) {
            if (row.boardID !== this.currentBoardID) {
                row.getDiv().classList.remove('Selected');
            } else {
                row.getDiv().classList.add('Selected');
            }
        }
        this.rows.sort((row1, row2) => {
            if (row1.boardID === this.currentBoardID) {
                return 1;
            }
            if (row1.numberInBoard < row2.numberInBoard) {
                return -1;
            }
            if (row1.numberInBoard > row2.numberInBoard) {
                return 1;
            }
            if (row1.lastModified < row2.lastModified) {
                return -1;
            }
            if (row1.lastModified > row2.lastModified) {
                return 1;
            }
            if (row1.tileCount < row2.tileCount) {
                return -1;
            }
            if (row1.tileCount > row2.tileCount) {
                return 1;
            }
            // row1 and row2 are equal
            return 0;
        });
    };

    createWorldClicked = () => {
        this.game.openCreateWorldPopover();
    };

    getRowByBoardID = (boardID) => {
        for(let row of this.rows){
            if(row.boardID === boardID) return row;
        }
        return null;
    };

    getDiv = () =>{
        return this.mainDiv;
    }

}