/**
 * Defines and holds the information for a chunk of tiles
 */
import {Tile} from "./Tile";
import {TileChunkRenderer} from "../TileLayerRenderer/TileChunkRenderer";

const Tile_Type_Background = 3;
const Tile_Type_Solid = 4;
const Tile_Type_Foreground = 5;

export class TileChunk {
    constructor(chunkX, chunkY, tileWidth, tileHeight) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
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
        //For rendering quickly
        this.backgroundColorRenderArray = TileChunkRenderer.CreateColorArray();
        this.foregroundColorRenderArray = TileChunkRenderer.CreateColorArray();
    }
    convertTileXToLocalX(tileX) {
        return tileX - (this.chunkX * this.tileWidth);
    }
    convertTileYToLocalY(tileY) {
        return tileY - (this.chunkY * this.tileHeight);
    }
    getTile(tileX, tileY, createNew = false) {
        let localX = this.convertTileXToLocalX(tileX);
        let localY = this.convertTileYToLocalY(tileY);
        let tile = this.tiles[localX][localY];
        if (tile === null && createNew === true) {
            tile = new Tile(tileX, tileY);
            this.tiles[localX][localY] = tile;
        }
        return tile;
    }
    setTile(tileX, tileY, typeID, r, g, b, a) {
        let tile = this.getTile(tileX, tileY, true);
        tile.setColor(r, g, b, a);
        tile.setTypeID(typeID);
        //Set the render color for fast rendering
        let localX = this.convertTileXToLocalX(tileX);
        let localY = this.convertTileYToLocalY(tileY);
        if (typeID === Tile_Type_Background || typeID === Tile_Type_Solid) {
            TileChunkRenderer.SetRectangleColorInColorArray(this.backgroundColorRenderArray, localX, localY, r, g, b, a);
        } else {
            TileChunkRenderer.SetRectangleColorInColorArray(this.backgroundColorRenderArray, localX, localY, 0, 0, 0, 0);
        }
        if (typeID === Tile_Type_Foreground) {
            TileChunkRenderer.SetRectangleColorInColorArray(this.foregroundColorRenderArray, localX, localY, r, g, b, a);
        } else {
            TileChunkRenderer.SetRectangleColorInColorArray(this.foregroundColorRenderArray, localX, localY, 0, 0, 0, 0);
        }
    }

    getBackgroundColorRenderArray = () => {
        return this.backgroundColorRenderArray;
    };

    getForegroundColorRenderArray = () => {
        return this.foregroundColorRenderArray;
    };

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
}