import {Interface} from "../../Utility/Interface.js";

export class BoardRow{
    constructor(boardName, boardID, numberInBoard, lastModified, tileCount){
        this.mainDiv = Interface.Create({type: div, className: 'BoardRow', elements: [

        ]})
    }

    getDiv = () => {
        return this.mainDiv;
    }
}