import {Interface} from "../../Utility/Interface";
import {ScorePopover} from "./ScorePopover";

export class Game{
    constructor(switchToLoginPage){
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'worldWrapper', elements: [
                    {type: 'canvas', className: 'gameArea'},
                    this.gameWorld = Interface.Create({type: 'div', className: 'worldSelect', elements: [
                        {type: 'div', text: 'Create World', className: 'createWorld', onClick: this.createNewWorld}
                    ]})
                ]},
                {type: 'div', className: 'chatArea', elements: [
                    this.chatArea = Interface.Create({type: 'div', className: 'messageLog'}),
                    this.messageInputbox = Interface.Create({type: 'input', inputType: 'text', className: 'textInput', placeholder: 'Enter your message...', onKeyDown: this.onChatboxEnter}),
                ]},
                {type: 'div', elements: [
                    {type: 'div', text: 'Logout', className: 'logoutBtn', onClick: () => {switchToLoginPage();}},
                    {type: 'div', text: 'Score', className: 'scoreButton', onClick: this.scoreButtonClicked}
                ]}
            ]}
        ]});
        this.scorePopover = new ScorePopover();
    }

    createNewWorld = () => {
        this.gameWorld.appendChild(Interface.Create({type: 'div', className: 'world', elements: [
            {type: 'p'}
        ]}));
    };

    addMessageToChatArea = (message) => {
        this.chatArea.insertBefore(Interface.Create({type: 'div', className: 'chatAreaMessage', html: message}), this.chatArea.firstChild);
    };

    onChatboxEnter = (event) => {
        if (event.keyCode === 13){
            this.addMessageToChatArea(this.messageInputbox.value);
            this.messageInputbox.value = '';
        }
    };


    scoreButtonClicked = () => {
        this.mainDiv.appendChild(this.scorePopover.getDiv());
    };

    getDiv = () => {
        return this.mainDiv;
    }
}