import {Interface} from "../../Utility/Interface.js";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";
import {Network} from "../../Networking/Network";
import spriteSheet from "../../../Images/walkcyclevarious.png";

export class SpritePopover {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.spriteID = 1;
        this.mainDiv = Interface.Create({type: 'div', className: 'SpritePopover', elements: [
            {type: 'div', elements: [
                {type: 'h2', text: 'Select your character'},
                this.sprite1 = Interface.Create({type: 'div', className: "Sprite1", onClick: this.sprite1Clicked,  elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip1'}
                ]}),
                this.sprite2 = Interface.Create({type: 'div', className: "Sprite2", onClick: this.sprite2Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip2'}
                ]}),
                this.sprite3 = Interface.Create({type: 'div', className: "Sprite3", onClick: this.sprite3Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip3'}
                ]}),
                this.sprite4 = Interface.Create({type: 'div', className: "Sprite4", onClick: this.sprite4Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip4'}
                ]}),
                this.sprite5 = Interface.Create({type: 'div', className: "Sprite5", onClick: this.sprite5Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip5'}
                ]}),
                this.sprite6 = Interface.Create({type: 'div', className: "Sprite6", onClick: this.sprite6Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip6'}
                ]}),
                this.sprite7 = Interface.Create({type: 'div', className: "Sprite7", onClick: this.sprite7Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip7'}
                ]}),
                this.sprite8 = Interface.Create({type: 'div', className: "Sprite8", onClick: this.sprite8Clicked, elements: [
                    {type: 'img', src: spriteSheet, className: 'Clip8'}
                ]}),
                {type: 'div', text: 'Save', className: 'SaveSprite', onClick: this.saveSprite},
                {type: 'div', text: 'Close', className: 'CloseButton', onClick: this.closeSelf}
            ]}
        ]});
    }

    closeSelf = () =>{
        this.gameLogic.focusOnGameCanvas();
        this.mainDiv.remove();
    };

    getDiv = () => {
        return this.mainDiv;
    };

    sprite1Clicked = () => {
        this.sprite1.classList.add('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 1;
    };

    sprite2Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.add('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 2;
    };

    sprite3Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.add('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 3;
    };

    sprite4Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.add('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 4;
    };

    sprite5Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.add('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 5;
    };

    sprite6Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.add('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 6;
    };

    sprite7Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.add('Selected');
        this.sprite8.classList.remove('Selected');
        this.spriteID = 7;
    };

    sprite8Clicked = () => {
        this.sprite1.classList.remove('Selected');
        this.sprite2.classList.remove('Selected');
        this.sprite3.classList.remove('Selected');
        this.sprite4.classList.remove('Selected');
        this.sprite5.classList.remove('Selected');
        this.sprite6.classList.remove('Selected');
        this.sprite7.classList.remove('Selected');
        this.sprite8.classList.add('Selected');
        this.spriteID = 8;
    };

    saveSprite = () => {
        Network.Send(GameMessageCreator.SpriteChange(this.spriteID));
    }
}