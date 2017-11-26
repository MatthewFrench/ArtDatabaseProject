const {MessageReader} = require("../../Utility/Message/MessageReader.js");
const Messages =
    require("./../MessageDefinitions/ClientMessageDefinitions.js").Controllers.Game.Messages;

let AddUpdateSelectorBoardListeners = [];
let SwitchToBoardListeners = [];
let AddPlayerListeners = [];
let RemovePlayerListeners = [];
let UpdatePlayerListeners = [];
let UpdateTileListeners = [];
let FocusPlayerIDListeners = [];

export class GameMessageHandler {
    static RouteMessage(message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.UpdateSelectorBoard: {
                GameMessageHandler.UpdateSelectorBoard(message);
            } break;
            case Messages.SwitchToBoard: {
                GameMessageHandler.SwitchToBoard(message);
            } break;
            case Messages.AddPlayer: {
                GameMessageHandler.AddPlayer(message);
            } break;
            case Messages.RemovePlayer: {
                GameMessageHandler.RemovePlayer(message);
            } break;
            case Messages.UpdatePlayer: {
                GameMessageHandler.UpdatePlayer(message);
            } break;
            case Messages.UpdateTile: {
                GameMessageHandler.UpdateTile(message);
            } break;
            case Messages.FocusPlayerID: {
                GameMessageHandler.FocusPlayerID(message);
            } break;
        }
    }

    static UpdateSelectorBoard(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardID = message.getUint32();
        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardName = message.getString();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let numberInBoard = message.getDouble();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let lastModified = message.getDouble();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let tileCount = message.getDouble();
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of AddUpdateSelectorBoardListeners) {
            callback(boardID, boardName, numberInBoard, lastModified, tileCount).then();
        }
    }

    static SwitchToBoard(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardID = message.getUint32();

        //Check for message end
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of SwitchToBoardListeners) {
            callback(boardID).then();
        }
    }

    static AddPlayer(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let playerID = message.getUint32();

        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let displayName = message.getString();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let x = message.getDouble();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let y = message.getDouble();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let speedX = message.getDouble();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let speedY = message.getDouble();

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let movingLeft = message.getUint8() !== 0;

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let movingRight = message.getUint8() !== 0;

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let jumping = message.getUint8() !== 0;

        //Check for message end
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of AddPlayerListeners) {
            callback(playerID, displayName, x, y, speedX, speedY, movingLeft, movingRight, jumping).then();
        }
    }

    static RemovePlayer(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let playerID = message.getUint32();

        //Check for message end
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of RemovePlayerListeners) {
            callback(playerID).then();
        }
    }

    static UpdatePlayer(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let playerID = message.getUint32();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let x = message.getDouble();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let y = message.getDouble();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let speedX = message.getDouble();

        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let speedY = message.getDouble();

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let movingLeft = message.getUint8() !== 0;

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let movingRight = message.getUint8() !== 0;

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let jumping = message.getUint8() !== 0;

        //Check for message end
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of UpdatePlayerListeners) {
            callback(playerID, x, y, speedX, speedY, movingLeft, movingRight, jumping).then();
        }
    }

    static UpdateTile(message) {
        //Parse message with validation
        if (!message.hasInt32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let x = message.getInt32();

        if (!message.hasInt32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let y = message.getInt32();

        if (!message.hasUint16()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let typeID = message.getUint16();

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let r = message.getUint8();

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let g = message.getUint8();

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let b = message.getUint8();

        if (!message.hasUint8()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let a = message.getUint8();

        //Check for message end
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of UpdateTileListeners) {
            callback(x, y, typeID, r, g, b, a).then();
        }
    }

    static FocusPlayerID(message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let playerID = message.getUint32();

        //Check for message end
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of FocusPlayerIDListeners) {
            callback(playerID).then();
        }
    }

    static AddUpdateSelectorBoardListener(callback) {
        AddUpdateSelectorBoardListeners.push(callback);
    }
    static AddSwitchToBoardListener(callback) {
        SwitchToBoardListeners.push(callback);
    }
    static AddAddPlayerListener(callback) {
        AddPlayerListeners.push(callback);
    }
    static AddRemovePlayerListener(callback) {
        RemovePlayerListeners.push(callback);
    }
    static AddUpdatePlayerListener(callback) {
        UpdatePlayerListeners.push(callback);
    }
    static AddUpdateTileListener(callback) {
        UpdateTileListeners.push(callback);
    }
    static AddFocusPlayerIDListener(callback) {
        FocusPlayerIDListeners.push(callback);
    }
}