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
import {SpritePopover} from "./SpritePopover";

export class Game{
    constructor(switchToLoginPage){
        this.gameLogic = new GameLogic();
        this.isSelectorOpen = true;
        this.mainDiv = Interface.Create({type:'div', className: 'GamePage', elements:[
            {type: 'div', className: 'GameContainer', elements: [
                {type: 'div', className: 'WorldWrapper', elements: [
                    this.selector = Interface.Create({type: 'div', className: 'ColorSelector', id: 'ColorSelector', elements:[
                        this.gameLogic.getRedSlider(),
                        this.gameLogic.getGreenSlider(),
                        this.gameLogic.getBlueSlider(),
                        this.gameLogic.getAlphaSlider(),
                        this.gameLogic.getEyeDropButton(),
                        this.gameLogic.getTileSelector(),
                        this.gameLogic.getPreviewSquare(),
                        this.gameLogic.getToolSelector(),
                        this.toggleSelector = Interface.Create({type: 'div', className: 'ToggleSelector', text: 'Minimize', onClick: this.slideToggle}),
                    ]}),
                    this.gameLogic.getVolumeSlider(),
                    this.gameLogic.getCanvas(),
                    (this.boardSelector = new BoardSelector(this)).getDiv()

                ]},
                {type: 'div', className: 'ChatArea', elements: [
                    this.chatArea = Interface.Create({type: 'div', className: 'MessageLog'}),
                    this.messageInputbox = Interface.Create({type: 'input', inputType: 'text', className: 'TextInput', placeholder: 'Enter your message...', onKeyDown: this.onChatboxEnter}),
                ]},
                {type: 'div', elements: [
                    {type: 'div', text: 'Logout', className: 'LogoutBtn', onClick: () => {switchToLoginPage();}},
                    {type: 'div', text: 'Score', className: 'ScoreButton', onClick: this.scoreButtonClicked},
                    {type: 'div', text: 'Sprite Select', className: 'SpriteButton', onClick: this.spriteButtonClicked}
                ]}
            ]}
        ]});
        this.spritePopover = new SpritePopover();
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

    focusOnGameCanvas = () => {
        this.gameLogic.getCanvas().focus();
    };

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

    gotPlayedAddedMessage = async (playerID, spriteID, displayName, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.gameLogic.addPlayer(playerID, spriteID, displayName, x, y, speedX, speedY, movingLeft, movingRight, jumping);
    };
    gotTileUpdateMessage = async (x, y, typeID, r, g, b, a) => {
        this.gameLogic.updateTile(x, y, typeID, r, g, b, a);
    };
    gotBoardSwitchedToMessage = async (boardID) => {
        this.boardSelector.setCurrentBoardID(boardID);
        this.boardSelector.sortBoards();
        this.gameLogic.resetBoardToNewBoard(boardID);
    };
    gotPlayerUpdatedMessage = async (playerID, spriteID, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.gameLogic.updatePlayer(playerID, spriteID, x, y, speedX, speedY, movingLeft, movingRight, jumping);
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
            this.focusOnGameCanvas();
        }
    };

    slideToggle = () => {
        if(this.isSelectorOpen){
            this.selector.style.top = `-${this.selector.clientHeight}px`;
            this.toggleSelector.innerHTML = 'Maximize';
            this.isSelectorOpen = false;
        }
        else{
            this.selector.style.top = '';
            this.toggleSelector.innerHTML = 'Minimize';
            this.isSelectorOpen = true;
        }
        this.focusOnGameCanvas();
    };

    openCreateWorldPopover = () => {
        this.mainDiv.appendChild(this.newWorldPopover.getDiv());
    };

    scoreButtonClicked = () => {
        this.mainDiv.appendChild(this.scorePopover.getDiv());
    };

    spriteButtonClicked = () =>{
        this.mainDiv.appendChild(this.spritePopover.getDiv());
    };

    getDiv = () => {
        return this.mainDiv;
    };
}