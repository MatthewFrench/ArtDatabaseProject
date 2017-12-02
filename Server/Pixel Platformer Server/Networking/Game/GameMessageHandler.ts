const {MessageReader} = require("../../Utility/MessageReader");
const Messages =
    require("./../MessageDefinitions/ServerMessageDefinitions").Controllers.Game.Messages;
import {Player} from "../../Player/Player";

//All listeners must be promises(async)
let CreateWorldListeners :
    ((player: Player, worldName: string) =>Promise<void>)[] = [];
let RequestBoardSwitchListeners :
    ((player: Player, boardID: number) =>Promise<void>)[] = [];
let SpriteChangeListeners :
    ((player: Player, spriteID: number) => Promise<void>) [] = [];
let MovingLeftListeners :
    ((player: Player, moving: boolean) =>Promise<void>)[] = [];
let MovingRightListeners :
    ((player: Player, moving: boolean) =>Promise<void>)[] = [];
let JumpingListeners :
    ((player: Player, moving: boolean) =>Promise<void>)[] = [];
let SetTileListeners :
    ((player: Player, x: number, y: number, typeID: number,
      r: number, g: number, b: number, a: number) =>Promise<void>)[] = [];

export class GameMessageHandler {
    static RouteMessage(player, message) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Messages.CreateNewWorld: {
                GameMessageHandler.CreateWorldMessage(player, message);
            } break;
            case Messages.RequestBoardSwitch: {
                GameMessageHandler.RequestBoardSwitch(player, message);
            } break;
            case Messages.SpriteChange: {
                GameMessageHandler.SpriteChange(player, message);
            } break;
            case Messages.MovingLeft: {
                GameMessageHandler.MovingLeft(player, message);
            } break;
            case Messages.MovingRight: {
                GameMessageHandler.MovingRight(player, message);
            } break;
            case Messages.Jumping: {
                GameMessageHandler.Jumping(player, message);
            } break;
            case Messages.SetTile: {
                GameMessageHandler.SetTile(player, message);
            } break;
        }
    }

    static CreateWorldMessage(player, message) {
        //Parse message with validation
        if (!message.hasString()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let worldName = message.getString();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of CreateWorldListeners) {
            callback(player, worldName).then();
        }
    }

    static RequestBoardSwitch(player, message) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let boardID = message.getUint32();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of RequestBoardSwitchListeners) {
            callback(player, boardID).then();
        }
    }

    static SpriteChange(player, message){
        //Parse message with validation
        if (!message.hasUint32()) {
            console.log('Invalid Try Sprite Change Message');
            return;
        }
        let spriteID = message.getUint32();
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Sprite Change Message');
            return;
        }
        //Send to all listeners
        for (let callback of SpriteChangeListeners) {
            callback(player, spriteID).then();
        }
    }

    static MovingLeft(player, message) {
        //Parse message with validation
        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let moving = message.getUint8() > 0;
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of MovingLeftListeners) {
            callback(player, moving).then();
        }
    }

    static MovingRight(player, message) {
        //Parse message with validation
        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let moving = message.getUint8() > 0;
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of MovingRightListeners) {
            callback(player, moving).then();
        }
    }

    static Jumping(player, message) {
        //Parse message with validation
        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let moving = message.getUint8() > 0;
        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of JumpingListeners) {
            callback(player, moving).then();
        }
    }

    static SetTile(player, message) {
        //Parse message with validation
        if (!message.hasInt32()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let x = message.getInt32();

        if (!message.hasInt32()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let y = message.getInt32();

        if (!message.hasUint16()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let typeID = message.getUint16();

        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let r = message.getUint8();

        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let g = message.getUint8();

        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let b = message.getUint8();

        if (!message.hasUint8()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        let a = message.getUint8();

        if (!message.isAtEndOfData()) {
            console.log('Invalid Try Create World Message');
            return;
        }
        //Send to all listeners
        for (let callback of SetTileListeners) {
            callback(player, x, y, typeID, r, g, b, a).then();
        }
    }

    static AddNewCreateWorldListener(callback : (player: Player, worldName: string) =>Promise<void>) {
        CreateWorldListeners.push(callback);
    }
    static AddRequestBoardSwitchListener(callback : (player: Player, boardID: number) =>Promise<void>) {
        RequestBoardSwitchListeners.push(callback);
    }
    static AddSpriteChangeListener(callback: (player: Player, spriteID: number) => Promise<void>){
        SpriteChangeListeners.push(callback);
    }
    static AddMovingLeftListener(callback: (player: Player, moving: boolean) => Promise<void>) {
        MovingLeftListeners.push(callback);
    }
    static AddMovingRightListener(callback: (player: Player, moving: boolean) =>Promise<void>) {
        MovingRightListeners.push(callback);
    }
    static AddJumpingListener(callback: (player: Player, moving: boolean) =>Promise<void>) {
        JumpingListeners.push(callback);
    }
    static AddSetTileListener(callback: (player: Player, x: number, y: number, typeID: number,
                                         r: number, g: number, b: number, a: number) =>Promise<void>) {
        SetTileListeners.push(callback);
    }
}