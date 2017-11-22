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
                {type: 'div', elements: [
                    {type: 'div', elements: [
                    this.numberInBoardDiv = Interface.Create({type: 'div', text: "Players in board: ", className: 'numberInBoardTag'}),
                    this.numberInBoardDiv = Interface.Create({type: 'div', text: numberInBoard, className: 'numberInBoard'}),
                        ]},
                    {type: 'div', elements: [
                    this.lastModifiedDiv = Interface.Create({type: 'div', text: "Last Modified: ", className: 'lastModifiedTag'}),
                    this.lastModifiedDiv = Interface.Create({type: 'div', text: lastModified, className: 'lastModified'}),
                        ]},
                    {type: 'div', elements: [
                    this.tileCountDiv = Interface.Create({type: 'div', text: "Number of tiles: ", className: 'tileCountTag'}),
                    this.tileCountDiv = Interface.Create({type: 'div', text: tileCount, className: 'tileCount'})
                        ]},
                ]},
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
        this.numberInBoardDiv.innerText = numberInBoard;
        this.lastModifiedDiv.innerText = lastModified;
        this.tileCountDiv.innerText = tileCount;
    };

}