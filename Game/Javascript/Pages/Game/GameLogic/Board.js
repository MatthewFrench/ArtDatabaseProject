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
        player.getServerMovementInfo().setX(x);
        player.getServerMovementInfo().setY(y);
        player.getServerMovementInfo().setSpeedX(speedX);
        player.getServerMovementInfo().setSpeedY(speedY);
        player.getServerMovementInfo().setMovingLeft(movingLeft);
        player.getServerMovementInfo().setMovingRight(movingRight);
        player.getServerMovementInfo().setJumping(jumping);

        player.getClientMovementInfo().setSpeedX(speedX);
        player.getClientMovementInfo().setSpeedY(speedY);
        player.getClientMovementInfo().setMovingLeft(movingLeft);
        player.getClientMovementInfo().setMovingRight(movingRight);
        player.getClientMovementInfo().setJumping(jumping);

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