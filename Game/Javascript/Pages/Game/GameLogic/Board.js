/*
This holds all Board data and logic.
Contains board size, players in board and tiles in the board.
 */

import {Tile} from "./Tile";
import {Player} from "./Player";

export class Board {
    constructor() {
        this.players = new Map();
        //Tile format: [x][y] = Tile
        this.tiles = new Map();
    }
    addPlayer = (playerID, name, x, y) => {
        let player = new Player(playerID, name, x, y);
        this.players.set(playerID, player);
        return player;
    };
    updatePlayer = (playerID, x, y) => {
        let player = this.getPlayer(playerID);
        if (player === null) {
            return;
        }
        player.setX(x);
        player.setY(y);
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
    setTileColor = (x, y, r, g, b, a) => {
        let tile = this.getTileCreate(x, y);
        tile.setColor(r, g, b, a);
    };
    clearBoard = () => {
        this.players = [];
        this.tiles = new Map();
    }
}