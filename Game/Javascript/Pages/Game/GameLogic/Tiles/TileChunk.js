/**
 * Defines and holds the information for a chunk of tiles
 */
import {Tile} from "./Tile";
import {TileLayerRenderer} from "../TileLayerRenderer/TileLayerRenderer";
import {GameLogic} from "../GameLogic";

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
        this.backgroundColorRenderArray = TileLayerRenderer.CreateColorArray();
        this.foregroundColorRenderArray = TileLayerRenderer.CreateColorArray();
        this.backgroundColorBuffer = GameLogic.GetBackgroundTileLayerRenderer().CreateBuffer();
        this.foregroundColorBuffer = GameLogic.GetForegroundTileLayerRenderer().CreateBuffer();
        this.dirtyBackgroundBuffer = true;
        this.dirtyForegroundBuffer = true;
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
            TileLayerRenderer.SetRectangleColorInColorArray(this.backgroundColorRenderArray, localX, localY, r, g, b, a);
            this.dirtyBackgroundBuffer = true;
        } else {
            TileLayerRenderer.SetRectangleColorInColorArray(this.backgroundColorRenderArray, localX, localY, 0, 0, 0, 0);
            this.dirtyBackgroundBuffer = true;
        }
        if (typeID === Tile_Type_Foreground) {
            TileLayerRenderer.SetRectangleColorInColorArray(this.foregroundColorRenderArray, localX, localY, r, g, b, a);
            this.dirtyForegroundBuffer = true;
        } else {
            TileLayerRenderer.SetRectangleColorInColorArray(this.foregroundColorRenderArray, localX, localY, 0, 0, 0, 0);
            this.dirtyForegroundBuffer = true;
        }
    }

    getBackgroundColorRenderArray = () => {
        return this.backgroundColorRenderArray;
    };

    getForegroundColorRenderArray = () => {
        return this.foregroundColorRenderArray;
    };

    getBackgroundColorBuffer = () => {
        return this.backgroundColorBuffer;
    };
    
    getForegroundColorBuffer = () => {
        return this.foregroundColorBuffer;
    };

    cleanBackgroundColorBuffer = () => {
        this.dirtyBackgroundBuffer = false;
    };
    cleanForegroundColorBuffer = () => {
        this.dirtyForegroundBuffer = false;
    };

    isBackgroundColorBufferDirty = () => {
        return this.dirtyBackgroundBuffer;
    };

    isForegroundColorBufferDirty = () => {
        return this.dirtyForegroundBuffer;
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