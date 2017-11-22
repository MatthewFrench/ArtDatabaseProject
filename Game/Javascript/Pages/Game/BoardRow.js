import {Interface} from "../../Utility/Interface.js";

export class BoardRow{
    constructor(boardName, boardID, numberInBoard, lastModified, tileCount){
        this.boardName = boardName;
        this.boardID = boardID;
        this.numberInBoard = numberInBoard;
        this.lastModified = lastModified;
        this.tileCount = tileCount;
        this.mainDiv = Interface.Create({type: 'div', className: 'BoardRow', elements: [
            {type: 'div', elements: [
                this.boardNameDiv = Interface.Create({type: 'div', text: boardName, className: 'boardName'}),
                this.boardIDDiv = Interface.Create({type: 'div', text: boardID, className: 'boardID'}),
                this.numberInBoardDiv = Interface.Create({type: 'div', text: numberInBoard, className: 'numberInBoard'}),
                this.lastModifiedDiv = Interface.Create({type: 'div', text: lastModified, className: 'lastModified'}),
                this.tileCountDiv = Interface.Create({type: 'div', text: tileCount, className: 'tileCount'})
            ]}
        ]})
    }

    getDiv = () => {
        return this.mainDiv;
    };

    update = (boardName, boardID, numberInBoard, lastModified, tileCount) => {
        this.boardName = boardName;
        this.boardID = boardID;
        this.numberInBoard = numberInBoard;
        this.lastModified = lastModified;
        this.tileCount = tileCount;

        this.boardNameDiv.innerText = boardName;
        this.boardIDDiv.innerText = boardID;
        this.numberInBoardDiv.innerText = numberInBoard;
        this.lastModifiedDiv.innerText = lastModified;
        this.tileCountDiv.innerText = tileCount;
    };

}