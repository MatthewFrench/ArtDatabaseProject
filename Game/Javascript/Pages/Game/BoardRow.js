import {Interface} from "../../Utility/Interface.js";

export class BoardRow{
    constructor(boardName, boardID, numberInBoard, lastModified, tileCount, boardClickedCallback){
        this.boardClickedCallback = boardClickedCallback;
        this.boardName = boardName;
        this.boardID = boardID;
        this.numberInBoard = numberInBoard;
        this.lastModified = lastModified;
        this.tileCount = tileCount;
        this.mainDiv = Interface.Create({type: 'div', className: 'BoardRow',
            onClick: () => {this.boardClickedCallback(this.boardID);},
            elements: [
            {type: 'div', elements: [
                this.boardNameDiv = Interface.Create({type: 'div', text: boardName, className: 'BoardName'}),
                {type: 'div', elements: [
                    {type: 'div', elements: [
                    this.numberInBoardDiv = Interface.Create({type: 'div', text: "Players in board: ", className: 'NumberInBoardTag'}),
                    this.numberInBoardDiv = Interface.Create({type: 'div', text: numberInBoard, className: 'NumberInBoard'}),
                        ]},
                    {type: 'div', elements: [
                    this.lastModifiedDiv = Interface.Create({type: 'div', text: "Last Modified: ", className: 'LastModifiedTag'}),
                    this.lastModifiedDiv = Interface.Create({type: 'div', text: new Date(lastModified).toLocaleString(), className: 'LastModified'}),
                        ]},
                    {type: 'div', elements: [
                    this.tileCountDiv = Interface.Create({type: 'div', text: "Number of tiles: ", className: 'TileCountTag'}),
                    this.tileCountDiv = Interface.Create({type: 'div', text: tileCount, className: 'TileCount'})
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
        this.lastModified = new Date(lastModified).toLocaleString();
        this.tileCount = tileCount;

        this.boardNameDiv.innerText = boardName;
        this.numberInBoardDiv.innerText = numberInBoard;
        this.lastModifiedDiv.innerText = new Date(lastModified).toLocaleString();
        this.tileCountDiv.innerText = tileCount;
    };

}