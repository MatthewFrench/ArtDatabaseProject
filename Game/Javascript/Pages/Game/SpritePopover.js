import {Interface} from "../../Utility/Interface.js";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";
import {Network} from "../../Networking/Network";

export class SpritePopover {
    constructor() {
        this.mainDiv = Interface.Create({type: 'div', className: 'SpritePopover', elements: [
            {type: 'div', elements: [
                {type: 'h2', text: 'Select your character'},
                {type: 'div', className: "Sprite1"},
                {type: 'div', className: "Sprite2"},
                {type: 'div', className: "Sprite3"},
                {type: 'div', className: "Sprite4"},
                {type: 'div', text: 'Save', className: 'SaveSprite', onClick: this.saveSprite},
                {type: 'div', text: 'Close', className: 'CloseButton', onClick: this.closeSelf}
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