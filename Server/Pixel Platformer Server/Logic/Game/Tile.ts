//Holds information for a tile.
export class Tile {
    boardID : number;
    tileID : number;
    typeID : number;
    x : number;
    y : number;
    r : number;
    g : number;
    b : number;
    a : number;
    creatorID : number;
    lastModifiedID : number;
    constructor(tileID, boardID, typeID, x, y, r, g, b, a, creatorID, lastModifiedID) {
        this.boardID = boardID;
        this.tileID = tileID;
        this.typeID = typeID;
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.creatorID = creatorID;
        this.lastModifiedID = lastModifiedID;
    }
    setColor = (r, g, b, a) => {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };
    setTypeID = (typeID) => {
        this.typeID = typeID;
    };
    setLastModifiedID = (playerID) => {
        this.lastModifiedID = playerID;
    };
    getX = () => {
        return this.x;
    };
    getY = () => {
        return this.y;
    };
    getR = () => {
        return this.r;
    };
    getG = () => {
        return this.g;
    };
    getB = () => {
        return this.b;
    };
    getA = () => {
        return this.a;
    };
    getTileID = () => {
        return this.tileID;
    };
    setTileID = (tileID) => {
        this.tileID = tileID;
    };
}