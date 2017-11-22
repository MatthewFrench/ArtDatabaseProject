import {Interface} from "../../Utility/Interface";
import {ScorePopover} from "./ScorePopover";
import {NewWorldPopover} from "./NewWorldPopover";
import {ChatMessageCreator} from "../../Networking/Chat/ChatMessageCreator";
import {Network} from "../../Networking/Network";
import {ChatMessageHandler} from "../../Networking/Chat/ChatMessageHandler";
import {GameRender} from "./GameRender";

export class Game{
    constructor(switchToLoginPage){
        this.gameRender = new GameRender();
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'worldWrapper', elements: [
                    this.gameRender.getCanvas(),
                    this.gameWorld = Interface.Create({type: 'div', className: 'worldSelect', elements: [
                        {type: 'div', text: 'Create World', className: 'createWorld', onClick: this.createWorldClicked}
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
        this.newWorldPopover = new NewWorldPopover();

        ChatMessageHandler.AddChatMessageListener(this.gotChatMessage);
    }

    gotChatMessage = async (boardID, playerID, chatPrefix, chatMessage, time) => {
        this.addMessageToChatArea(chatPrefix + ' : ' + chatMessage);
    };

    addMessageToChatArea = (message) => {
        this.chatArea.insertBefore(Interface.Create({type: 'div', className: 'chatAreaMessage', html: message}), this.chatArea.firstChild);
    };

    onChatboxEnter = (event) => {
        if (event.keyCode === 13){
            Network.Send(ChatMessageCreator.NewChatMessage(this.messageInputbox.value));
            //this.addMessageToChatArea(this.messageInputbox.value);
            this.messageInputbox.value = '';
        }
    };


    createWorldClicked = () => {
        this.mainDiv.appendChild(this.newWorldPopover.getDiv());
    };

    scoreButtonClicked = () => {
        this.mainDiv.appendChild(this.scorePopover.getDiv());
    };

    getDiv = () => {
        return this.mainDiv;
    }
}