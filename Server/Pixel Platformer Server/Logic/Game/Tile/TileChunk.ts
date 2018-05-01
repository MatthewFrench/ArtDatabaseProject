/**
 * Defines and holds the information for a chunk of tiles
 */
import {Tile} from "./Tile";
import {Player} from "../../../Player/Player";
import {GameMessageCreator} from "../../../Networking/Game/GameMessageCreator";

const Tile_Type_Deleted = 6;

export class TileChunk {
    chunkX;
    chunkY;
    tileWidth;
    tileHeight;
    tiles : Tile[][];
    tileCount = 0;
    playersInSight : Player[];

    constructor(chunkX, chunkY, tileWidth, tileHeight) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.playersInSight = [];
        //This is going to be a double array
        //All tiles are in a hard double array
        this.tiles = [];
        for (let x = 0; x < tileWidth; x++) {
            let columnArray = [];
            for (let y = 0; y < tileHeight; y++) {
                columnArray.push(null);
            }
            this.tiles.push(columnArray);
        }
    }
    convertTileXToLocalX(tileX) {
        return tileX - (this.chunkX * this.tileWidth);
    }
    convertTileYToLocalY(tileY) {
        return tileY - (this.chunkY * this.tileHeight);
    }
    getTile(tileX, tileY) {
        let localX = this.convertTileXToLocalX(tileX);
        let localY = this.convertTileYToLocalY(tileY);
        return this.tiles[localX][localY];
    }
    setTile(boardID, typeID, tileX, tileY ,r, g, b, a, creatorID, lastModifiedID) {
        let tile = this.getTile(tileX, tileY);
        if (tile === null) {
            tile = new Tile(boardID, typeID, tileX, tileY, r, g, b, a, creatorID, lastModifiedID);
            let localX = this.convertTileXToLocalX(tileX);
            let localY = this.convertTileYToLocalY(tileY);
            this.tiles[localX][localY] = tile;
            this.tileCount += 1;
        } else {
            tile.setColor(r, g, b, a);
            tile.setTypeID(typeID);
        }
        return tile;
    }

    getChunkX = () => {
        return this.chunkX;
    };

    getChunkY = () => {
        return this.chunkY;
    };

    getChunkTileX = () => {
        return this.chunkX * this.tileWidth;
    };

    getChunkTileY = () => {
        return this.chunkY * this.tileHeight;
    };

    getTileCount = () => {
        return this.tileCount;
    };

    addPlayerInSight = (player: Player) => {
        this.playersInSight.push(player);
    };

    getPlayersInSight = () => {
        return this.playersInSight;
    };

    hasPlayerInSight = (player: Player) => {
        let playerIndex = this.playersInSight.indexOf(player);
        return playerIndex !== -1;
    };

    removePlayerInSight = (player: Player) => {
        let playerIndex = this.playersInSight.indexOf(player);
        if (playerIndex !== -1) {
            this.playersInSight.splice(playerIndex, 1);
        }
    };

    sendTilesToPlayer = (player : Player) => {
        player.send(GameMessageCreator.UpdateChunk(this));
    };

    getTiles = () => {
        return this.tiles;
    };

    getTileWidth = () => {
        return this.tileWidth;
    };

    getTileHeight = () => {
        return this.tileHeight;
    };
}