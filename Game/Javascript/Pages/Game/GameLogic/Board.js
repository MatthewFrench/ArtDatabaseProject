/*
This holds all Board data and logic.
Contains board size, players in board and tiles in the board.
 */

import {Tile} from "./Tiles/Tile";
import {Player} from "./Player";
import {TileWorld} from "./Tiles/TileWorld";

export class Board {
    constructor(boardID) {
        this.boardID = boardID;
        this.players = new Map();
        this.tileWorld = new TileWorld();
    }

    addPlayer = (playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        let player = new Player(playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping);
        this.players.set(playerID, player);
        return player;
    };
    updatePlayer = (playerID, spriteID, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        let player = this.getPlayer(playerID);
        if (player === null) {
            return;
        }

        let clientInfo = player.getClientMovementInfo();
        let serverInfo = player.getServerMovementInfo();

        //Set the client position to be the approximate server position
        clientInfo.setX(serverInfo.getX());
        clientInfo.setY(serverInfo.getY());
        clientInfo.setSpeedX(serverInfo.getSpeedX());
        clientInfo.setSpeedY(serverInfo.getSpeedY());

        //Update the server position
        serverInfo.setX(x);
        serverInfo.setY(y);
        serverInfo.setSpeedX(speedX);
        serverInfo.setSpeedY(speedY);
        serverInfo.setMovingLeft(movingLeft);
        serverInfo.setMovingRight(movingRight);
        serverInfo.setJumping(jumping);

        //player.getClientMovementInfo().setSpeedX(speedX);
        //player.getClientMovementInfo().setSpeedY(speedY);
        clientInfo.setMovingLeft(movingLeft);
        clientInfo.setMovingRight(movingRight);
        clientInfo.setJumping(jumping);

        //Interpolate the client position to the server position
        clientInfo.interpolationRunning = true;
        clientInfo.interpolationDistanceX = Math.abs(clientInfo.getX() - serverInfo.getY());
        clientInfo.interpolationDistanceY = Math.abs(clientInfo.getY() - serverInfo.getY());
        clientInfo.interpolationSpeedX = Math.abs(clientInfo.getSpeedX() - serverInfo.getSpeedX());
        clientInfo.interpolationSpeedY = Math.abs(clientInfo.getSpeedY() - serverInfo.getSpeedY());
        clientInfo.interpolationStopwatch.reset();

        player.setSpriteID(spriteID);
    };
    getPlayer = (playerID) => {
        let player = this.players.get(playerID);
        if (player === undefined) {
            return null;
        }
        return player;
    };
    getPlayers = () => {
        return this.players;
    };
    removePlayer = (playerID) => {
        this.players.delete(playerID);
    };
    getTile = (x, y) => {
        return this.tileWorld.getTile(x, y);
    };
    getTileCreate = (x, y) => {
        return this.tileWorld.getTile(x, y, true);
    };
    setTile = (x, y, typeID, r, g, b, a) => {
        this.tileWorld.setTile(x, y, typeID, r, g, b, a);
    };
    updateChunk = (chunkX, chunkY, tileData) => {
        this.tileWorld.updateChunk(chunkX, chunkY, tileData);
    };
}