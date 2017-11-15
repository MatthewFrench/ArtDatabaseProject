import {Interface} from "../../Utility/Interface.js";

export class ScorePopover {
    constructor() {
        this.mainDiv = Interface.Create({type: 'div', className: 'ScorePopover', elements: [
            {type: 'div', elements: [
                {type: 'h2', text: 'SCORE', className: 'ScoreTitle'},
            ]}
        ]});
    }
    getDiv = () => {
        return this.mainDiv;
    }
}