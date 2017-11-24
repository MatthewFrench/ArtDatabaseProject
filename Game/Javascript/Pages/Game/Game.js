import {Interface} from "../../Utility/Interface";
import {ScorePopover} from "./ScorePopover";
import {NewWorldPopover} from "./NewWorldPopover";
import {ChatMessageCreator} from "../../Networking/Chat/ChatMessageCreator";
import {Network} from "../../Networking/Network";
import {ChatMessageHandler} from "../../Networking/Chat/ChatMessageHandler";
import {GameLogic} from "./GameLogic/GameLogic";
import {GameMessageHandler} from "../../Networking/Game/GameMessageHandler";
import {BoardSelector} from "./BoardSelector";

export class Game{
    constructor(switchToLoginPage){
        this.gameLogic = new GameLogic();
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'WorldWrapper', elements: [
                    this.gameLogic.getCanvas(),
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
        this.visible = false;

        ChatMessageHandler.AddChatMessageListener(this.gotChatMessage);
        GameMessageHandler.AddUpdateSelectorBoardListener(this.updateSelectorBoard);
    }

    setVisibility = (visible) => {
        this.visible = visible;
        this.gameLogic.setVisibility(visible);
    };

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