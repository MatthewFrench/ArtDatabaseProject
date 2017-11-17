import {Interface} from "../../Utility/Interface";

export class Game{
    constructor(switchToLoginPage){
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'worldWrapper', elements: [
                    {type: 'canvas', className: 'gameArea'},
                    {type: 'div', className: 'worldSelect'}
                ]},
                {type: 'div', className: 'chatArea', elements: [
                    {type: 'textarea', className: 'messageLog'},
                    {type: 'input', inputType: 'text', className: 'textInput', placeholder: 'Enter your message...'}
                ]},
                {type: 'div', text: 'Logout', className: 'logoutBtn', onClick: () => {switchToLoginPage();}},
            ]}
        ]});
    }
    getDiv = () => {
        return this.mainDiv;
    }
}