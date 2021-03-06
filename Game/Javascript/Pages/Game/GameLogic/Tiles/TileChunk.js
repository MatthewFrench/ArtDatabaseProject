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
        this.backgroundColorBuffer = null;
        this.foregroundColorBuffer = null;
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
        return this.getLocalTile(tileX, tileY, localX, localY, createNew);
    }
    getLocalTile(tileX, tileY, localX, localY, createNew = false) {
        let tile = this.tiles[localX][localY];
        if (tile === null && createNew === true) {
            tile = new Tile(tileX, tileY);
            this.tiles[localX][localY] = tile;
        }
        return tile;
    }
    setTile(tileX, tileY, typeID, r, g, b, a) {
        let localX = this.convertTileXToLocalX(tileX);
        let localY = this.convertTileYToLocalY(tileY);
        let tile = this.getLocalTile(tileX, tileY, localX, localY, true);
        tile.setColor(r, g, b, a);
        tile.setTypeID(typeID);

        //Set the render color for fast rendering
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

    releaseBuffers = () => {
        GameLogic.GetBackgroundTileLayerRenderer().ReturnBuffer(this.backgroundColorBuffer, this);
        this.backgroundColorBuffer = null;
        GameLogic.GetForegroundTileLayerRenderer().ReturnBuffer(this.foregroundColorBuffer, this);
        this.foregroundColorBuffer = null;
        this.dirtyBackgroundBuffer = true;
        this.dirtyForegroundBuffer = true;
    };

    getBackgroundColorRenderArray = () => {
        return this.backgroundColorRenderArray;
    };

    getForegroundColorRenderArray = () => {
        return this.foregroundColorRenderArray;
    };

    getBackgroundColorBuffer = () => {
        if (this.backgroundColorBuffer === null) {
            this.backgroundColorBuffer = GameLogic.GetBackgroundTileLayerRenderer().GetBuffer(this);
            this.dirtyBackgroundBuffer = true;
        }
        return this.backgroundColorBuffer;
    };
    
    getForegroundColorBuffer = () => {
        if (this.foregroundColorBuffer === null) {
            this.foregroundColorBuffer = GameLogic.GetForegroundTileLayerRenderer().GetBuffer(this);
            this.dirtyForegroundBuffer = true;
        }
        return this.foregroundColorBuffer;
    };

    cleanBackgroundColorBuffer = () => {
        this.dirtyBackgroundBuffer = false;
    };
    cleanForegroundColorBuffer = () => {
        this.dirtyForegroundBuffer = false;
    };

    isBackgroundColorBufferDirty = () => {
        return this.dirtyBackgroundBuffer || this.backgroundColorBuffer === null;
    };

    isForegroundColorBufferDirty = () => {
        return this.dirtyForegroundBuffer || this.foregroundColorBuffer === null;
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