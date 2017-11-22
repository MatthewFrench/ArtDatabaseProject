import {Interface} from "../../Utility/Interface.js";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";
import {Network} from "../../Networking/Network";

export class NewWorldPopover {
    constructor() {
        this.mainDiv = Interface.Create({type: 'div', className: 'NewWorldPopover', elements: [
            {type: 'div', elements: [
                {type: 'h2', text: 'Create New World', className: 'newWorldHeader'},
                {type: 'label', text: 'World Name: ', className: 'nameLabel'},
                this.name = Interface.Create({type: 'input', inputType: 'text', className: 'newWorldName'}),
                {type: 'p'},
                {type: 'div', text: 'Save World', className: 'createWorld', onClick: this.saveWorld},
                {type: 'div', text: 'Close', className: 'closeButton', onClick: this.closeSelf}
            ]}
        ]});
    }

    saveWorld = () => {
        Network.Send(GameMessageCreator.NewWorldMessage(this.name.value));
        this.closeSelf();
    };

    closeSelf = () =>{
        this.mainDiv.remove();
    };

    getDiv = () => {
        return this.mainDiv;
    }
}