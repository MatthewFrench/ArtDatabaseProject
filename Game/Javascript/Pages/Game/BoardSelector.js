import {Interface} from "../../Utility/Interface.js";
import {BoardRow} from "./BoardRow.js";

export class BoardSelector {
    constructor(game) {
        this.game = game;
        this.rows = [];
        this.mainDiv = Interface.Create({
            type: 'div', className: 'BoardSelector', elements: [
                {type: 'div', text: 'Create World', className: 'CreateWorld', onClick: this.createWorldClicked},
                this.rowContainer = Interface.Create({type: 'div', className: 'RowContainer'})
            ]
        })
    }


    updateBoard = (boardName, boardID, numberInBoard, lastModified, tileCount) => {
        let foundRow = this.getRowByBoardID(boardID);
        if(foundRow === null){
            let newRow = new BoardRow(boardName, boardID, numberInBoard, lastModified, tileCount);
            this.rows.push(newRow);
            this.rowContainer.appendChild(newRow.getDiv());
        }
        else{
            foundRow.update(boardName, boardID, numberInBoard, lastModified, tileCount);
        }
    };

    sortBoards = () => {
        this.rows.sort((row1, row2) => {
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