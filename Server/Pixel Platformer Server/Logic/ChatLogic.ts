import {Player} from "../Player/Player";
import {ChatMessageCreator as MsgCreator} from "../Networking/Chat/ChatMessageCreator";
import {MessageWriter} from "../Utility/MessageWriter";
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

        //let message = MsgCreator.AddChatMessage(-1, -1);
    };
}