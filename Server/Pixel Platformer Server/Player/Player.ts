import {PlayerAccountData} from "./PlayerAccountData";
import {PlayerGameData} from "./PlayerGameData";
import {MessageWriter} from "../Utility/MessageWriter";
import {Controllers as ClientDefinitions} from "../Networking/MessageDefinitions/ClientMessageDefinitions";

const MessageMaxBufferSize = 1100;

export class Player {
    private socket: any;
    private accountData: any;
    private gameData: any;
    private messageBufferQueue: Buffer[] = [];
    private messageTotalRawBinarySize = 0;
    constructor(socket) {
        this.socket = socket;
        this.accountData = new PlayerAccountData();
        this.gameData = new PlayerGameData();
    }
    send(binary, sendImmediately = false) {
        //Check if we're going over the limit, flush first if so
        if (this.getMessageBufferCalculatedLength() + binary.length + 4 > MessageMaxBufferSize) {
            this.flushSendQueue();
        }

        this.messageBufferQueue.push(binary);
        this.messageTotalRawBinarySize += binary.length;

        if (sendImmediately) {
            this.flushSendQueue();
        }
    }
    flushSendQueue() {
        if (this.messageTotalRawBinarySize === 0) {
            return;
        }
        if (this.messageBufferQueue.length === 1) {
            //Only send one
            this.socket.send(this.messageBufferQueue[0]);
        } else {
            //Create message writer to combine all packets
            let combinedMessage = new MessageWriter();
            combinedMessage.addUint8(ClientDefinitions.Network.ID);
            combinedMessage.addUint8(ClientDefinitions.Network.Messages.CombinedMessage);
            for (let binary of this.messageBufferQueue) {
                combinedMessage.addBinary(binary);
            }
            this.socket.send(combinedMessage.toBuffer());
        }

        this.messageBufferQueue = [];
        this.messageTotalRawBinarySize = 0;
    }

    getMessageBufferCalculatedLength() {
        let length = this.messageTotalRawBinarySize;
        //Add the size of adding all the binaries to a message writer
        length += this.messageBufferQueue.length * 4;
        //Add the 4 bytes of length for total message size
        length += 4;
        //Add the controller and message identifier bytes of the message writer
        length += 2;
        return length;
    }

    getSocket() {
        return this.socket;
    }
    getAccountData() : PlayerAccountData {
        return this.accountData;
    }
    getGameData() : PlayerGameData {
        return this.gameData;
    }
}