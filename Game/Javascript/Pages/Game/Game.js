import {Interface} from "../../Utility/Interface";
import {ScorePopover} from "./ScorePopover";
import {NewWorldPopover} from "./NewWorldPopover";
import {ChatMessageCreator} from "../../Networking/Chat/ChatMessageCreator";
import {Network} from "../../Networking/Network";
import {ChatMessageHandler} from "../../Networking/Chat/ChatMessageHandler";
import {GameRender} from "./Renderer/GameRender";
import {GameMessageHandler} from "../../Networking/Game/GameMessageHandler";
import {BoardSelector} from "./BoardSelector";

export class Game{
    constructor(switchToLoginPage){
        this.gameRender = new GameRender();
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'WorldWrapper', elements: [
                    this.gameRender.getCanvas(),
                    (this.boardSelector = new BoardSelector(this)).getDiv()
                ]},
                {type: 'div', className: 'ChatArea', elements: [
                    this.chatArea = Interface.Create({type: 'div', className: 'MessageLog'}),
                    this.messageInputbox = Interface.Create({type: 'input', inputType: 'text', className: 'TextInput', placeholder: 'Enter your message...', onKeyDown: this.onChatboxEnter}),
                ]},
                {type: 'div', elements: [
                    {type: 'div', text: 'Logout', className: 'LogoutBtn', onClick: () => {switchToLoginPage();}},
                    {type: 'div', text: 'Score', className: 'ScoreButton', onClick: this.scoreButtonClicked}
                ]}
            ]}
        ]});
        this.scorePopover = new ScorePopover();
        this.newWorldPopover = new NewWorldPopover();


        ChatMessageHandler.AddChatMessageListener(this.gotChatMessage);
        GameMessageHandler.AddUpdateSelectorBoardListener(this.updateSelectorBoard);
    }

    updateSelectorBoard = async(boardID, boardName, numberInBoard, lastModified, tileCount) => {
        this.boardSelector.updateBoard(boardName, boardID, numberInBoard, lastModified, tileCount);
        this.boardSelector.sortBoards();
    };

    gotChatMessage = async (boardID, playerID, chatPrefix, chatMessage, time) => {
        this.addMessageToChatArea(chatPrefix + ' : ' + chatMessage);
    };

    addMessageToChatArea = (message) => {
        this.chatArea.insertBefore(Interface.Create({type: 'div', className: 'ChatAreaMessage', html: message}), this.chatArea.firstChild);
    };

    onChatboxEnter = (event) => {
        if (event.keyCode === 13){
            Network.Send(ChatMessageCreator.NewChatMessage(this.messageInputbox.value));
            //this.addMessageToChatArea(this.messageInputbox.value);
            this.messageInputbox.value = '';
        }
    };



    openCreateWorldPopover = () => {
        this.mainDiv.appendChild(this.newWorldPopover.getDiv());
    };

    scoreButtonClicked = () => {
        this.mainDiv.appendChild(this.scorePopover.getDiv());
    };

    getDiv = () => {
        return this.mainDiv;
    };
}