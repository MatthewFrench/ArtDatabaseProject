

import {Board} from "../Logic/Game/Board";

export class PlayerGameData {
    private currentBoard : Board = null;
    private locationX = 0;
    private locationY = 0;
    private speedX = 0;
    private speedY = 0;
    private movingLeft = false;
    private movingRight = false;
    private jumping = false;
    private currentChunkX = null;
    private currentChunkY = null;
    constructor() {

    }
    getCurrentBoardID = () => {
        if (this.currentBoard === null) {
            return -1;
        }
        return this.currentBoard.getBoardID();
    };
    getCurrentBoard = () => {
        return this.currentBoard;
    };
    setCurrentBoard = (board) => {
        this.currentBoard = board;
    };
    getX = () => {
        return this.locationX;
    };
    getY = () => {
        return this.locationY;
    };
    getSpeedX = () => {
        return this.speedX;
    };
    getSpeedY = () => {
        return this.speedY;
    };
    getMovingLeft = () => {
        return this.movingLeft;
    };
    getMovingRight = () => {
        return this.movingRight;
    };
    getJumping = () => {
        return this.jumping;
    };

    setX = (x) => {
        this.locationX = x;
    };
    setY = (y) => {
        this.locationY = y;
    };
    setSpeedX = (x) => {
        this.speedX = x;
    };
    setSpeedY = (y) => {
        this.speedY = y;
    };
    setMovingLeft = (value) => {
        this.movingLeft = value;
    };
    setMovingRight = (value) => {
        this.movingRight = value;
    };
    setJumping = (value) => {
        this.jumping = value;
    };
    getCurrentChunkX = () => {
        return this.currentChunkX;
    };
    getCurrentChunkY = () => {
        return this.currentChunkY;
    };
    setCurrentChunkX = (currentChunkX) => {
        this.currentChunkX = currentChunkX;
    };
    setCurrentChunkY = (currentChunkY) => {
        this.currentChunkY = currentChunkY;
    };
}