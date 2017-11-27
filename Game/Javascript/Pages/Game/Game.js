import {Interface} from "../../Utility/Interface";
import {ScorePopover} from "./ScorePopover";
import {NewWorldPopover} from "./NewWorldPopover";
import {ChatMessageCreator} from "../../Networking/Chat/ChatMessageCreator";
import {Network} from "../../Networking/Network";
import {ChatMessageHandler} from "../../Networking/Chat/ChatMessageHandler";
import {GameLogic} from "./GameLogic/GameLogic";
import {GameMessageHandler} from "../../Networking/Game/GameMessageHandler";
import {BoardSelector} from "./BoardSelector";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";

export class Game{
    constructor(switchToLoginPage){
        this.gameLogic = new GameLogic();
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'WorldWrapper', elements: [
                    this.gameLogic.getRedSlider(),
                    this.gameLogic.getGreenSlider(),
                    this.gameLogic.getBlueSlider(),
                    this.gameLogic.getAlphaSlider(),
                    this.gameLogic.getCanvas(),
                    this.gameLogic.getEyeDropButton(),
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
        GameMessageHandler.AddAddPlayerListener(this.gotPlayedAddedMessage);
        GameMessageHandler.AddUpdateTileListener(this.gotTileUpdateMessage);
        GameMessageHandler.AddSwitchToBoardListener(this.gotBoardSwitchedToMessage);
        GameMessageHandler.AddUpdatePlayerListener(this.gotPlayerUpdatedMessage);
        GameMessageHandler.AddRemovePlayerListener(this.gotPlayerRemovedMessage);
        GameMessageHandler.AddFocusPlayerIDListener(this.gotSetPlayerFocusMessage);
    }

    //Event handler from the board selector
    requestSwitchToBoard = (boardID) => {
        Network.Send(GameMessageCreator.RequestBoardSwitch(boardID));
    };

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


    gotPlayedAddedMessage = async (playerID, displayName, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.gameLogic.addPlayer(playerID, displayName, x, y, speedX, speedY, movingLeft, movingRight, jumping);
    };
    gotTileUpdateMessage = async (x, y, typeID, r, g, b, a) => {
        this.gameLogic.updateTile(x, y, typeID, r, g, b, a);
    };
    gotBoardSwitchedToMessage = async (boardID) => {
        this.gameLogic.resetBoardToNewBoard(boardID);
    };
    gotPlayerUpdatedMessage = async (playerID, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.gameLogic.updatePlayer(playerID, x, y, speedX, speedY, movingLeft, movingRight, jumping);
    };
    gotPlayerRemovedMessage = async (playerID) => {
        this.gameLogic.removePlayer(playerID);
    };
    gotSetPlayerFocusMessage = async (playerID) => {
        this.gameLogic.setPlayerFocusID(playerID);
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