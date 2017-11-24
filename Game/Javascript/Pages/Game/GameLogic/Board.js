/*
This holds all Board data and logic.
Contains board size, players in board and tiles in the board.
 */

export class Board {
    constructor() {
        this.players = [];
        //Tile format: [x][y] = Tile
        this.tiles = new Map();
    }
    getTile = (x, y) => {
        let column = this.tiles.get(x);
        if (column === undefined) {
            column = new Map();
            this.tiles.set(x, column);
        }
        let tile = this.column.get(y);
        if (tile === undefined) {
            tile = new Tile(x, y);
            this.column.set(y, tile);
        }
        return this.tile;
    };
    setTileColor = (x, y, r, g, b, a) => {
        let tile = this.getTile(x, y);
        tile.setColor(r, g, b, a);
    };
}