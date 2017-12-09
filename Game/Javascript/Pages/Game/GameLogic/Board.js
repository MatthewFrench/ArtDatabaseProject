/*
This holds all Board data and logic.
Contains board size, players in board and tiles in the board.
 */

import {Tile} from "./Tile";
import {Player} from "./Player";

export class Board {
    constructor(boardID) {
        this.boardID = boardID;
        this.players = new Map();
        //Tile format: [x][y] = Tile
        this.tiles = new Map();
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
        let column = this.tiles.get(x);
        if (column === undefined) {
            return null;
        }
        let tile = column.get(y);
        if (tile === undefined) {
            return null;
        }
        return tile;
    };
    getTileCreate = (x, y) => {
        let column = this.tiles.get(x);
        if (column === undefined) {
            column = new Map();
            this.tiles.set(x, column);
        }
        let tile = column.get(y);
        if (tile === undefined) {
            tile = new Tile(x, y);
            column.set(y, tile);
        }
        return tile;
    };
    setTile = (x, y, typeID, r, g, b, a) => {
        let tile = this.getTileCreate(x, y);
        tile.setColor(r, g, b, a);
        tile.setTypeID(typeID);
    };
}