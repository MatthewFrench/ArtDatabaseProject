import {Player} from "../Player/Player";
import {ChatMessageCreator as MsgCreator} from "../Networking/Chat/ChatMessageCreator";
import {MessageWriter} from "../Utility/MessageWriter";
import {Utility} from "../Utility/Utility";
import {NetworkHandler} from "../Networking/NetworkHandler";
const MsgHandler = require("./../Networking/Chat/ChatMessageHandler").ChatMessageHandler;

export class ChatLogic {
    server: any;
    constructor(server) {
        this.server = server;
        MsgHandler.AddNewChatMessageListener(this.handleNewChatMessage);
    }
    playerConnected = async (player) => {
    };
    playerDisconnected = async (player) => {
    };

    handleNewChatMessage = async (player : Player, chatMessage : string) => {
        //Send message to all players and store in database

        let time = new Date();

        let messagePrefix = time.toLocaleString() + ', ' +
            '[Board Name]' + ', ' +
            player.getAccountData().getDisplayName();

        //Santize chat message
        chatMessage = Utility.SanitizeHTML(chatMessage);

        NetworkHandler.SendToAll(MsgCreator.AddChatMessage(
            player.getGameData().getCurrentBoardID(),
            player.getAccountData().getPlayerID(),
            messagePrefix,
            chatMessage,
            time));
    };
}