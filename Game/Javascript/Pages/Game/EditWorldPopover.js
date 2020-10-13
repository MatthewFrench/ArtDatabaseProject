import {Interface} from "../../Utility/Interface";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";
import {Network} from "../../Networking/Network";

export class EditWorldPopover {
    constructor() {
        this.mainDiv = Interface.Create({type: 'div', className: 'EditWorldPopover', elements: [
            {type: 'div', elements: [
                {type: 'h2', text: 'World Properties', className: 'EditWorldHeader'},
                {type: 'label', text: 'Race mode: ', className: 'RaceLabel'},
                {type: 'input', inputType: 'checkbox'},
                {type: 'p'},
                {type: 'label', text: 'Min. players: '},
                {type: 'input', inputType: 'textbox', className: 'minPlayerInput'},
                {type: 'label', text: 'Max players: '},
                {type: 'input', inputType: 'textbox', className: 'maxPlayerInput'},
                {type: 'p'},
                {type: 'label', text: 'Disable Editing: ', className: 'editLabel'},
                {type: 'input', inputType: 'checkbox'},
                {type: 'p'},
                {type: 'div', text: 'Save World', className: 'SaveWorldButton', onClick: this.saveWorld},
                {type: 'div', text: 'Delete World', className: 'DeleteWorldButton'},
                {type: 'div', text: 'Close', className: 'CloseButton', onClick: this.closeSelf}
            ]}
        ]});
    }

    saveWorld = () => {
        this.closeSelf();
    };

    closeSelf = () =>{
        this.mainDiv.remove();
    };

    getDiv = () => {
        return this.mainDiv;
    }
}