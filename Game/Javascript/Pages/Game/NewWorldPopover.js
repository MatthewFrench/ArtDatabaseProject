import {Interface} from "../../Utility/Interface.js";

export class NewWorldPopover {
    constructor() {
        this.mainDiv = Interface.Create({type: 'div', className: 'NewWorldPopover', elements: [
            {type: 'div', elements: [
                {type: 'h2', text: 'Create New World', className: 'newWorldHeader'},
                {type: 'label', text: 'World Name: ', className: 'nameLabel'},
                {type: 'input', inputType: 'text', className: 'newWorldName'},
                {type: 'p'},
                {type: 'div', text: 'Save World', className: 'createWorld'},
                {type: 'div', text: 'Close', className: 'closeButton', onClick: this.closeSelf}
            ]}
        ]});
    }

    closeSelf = () =>{
        this.mainDiv.remove();
    };

    getDiv = () => {
        return this.mainDiv;
    }
}