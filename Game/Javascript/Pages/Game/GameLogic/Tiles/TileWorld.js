import {TileChunk} from "./TileChunk";

const Chunk_Width = 25;
const Chunk_Height = 25;
/**
 * Holds all the tile chunks
 */
export class TileWorld {
    constructor() {
        //X is tile chunk X, so chunk at X 1 will be so much tiles from origin defined above.
        //Tile format: [chunkX][chunkY] = Tile
        this.tileChunks = new Map();
    }
    convertTileXToChunkX = (tileX) => {
        return Math.floor(tileX / Chunk_Width);
    };
    convertTileYToChunkY = (tileY) => {
        return Math.floor(tileY / Chunk_Height);
    };
    getChunksInTileRange(tileStartX, tileStartY, tileEndX, tileEndY) {
        let chunkStartX = this.convertTileXToChunkX(tileStartX);
        let chunkStartY = this.convertTileYToChunkY(tileStartY);
        let chunkEndX = this.convertTileXToChunkX(tileEndX);
        let chunkEndY = this.convertTileYToChunkY(tileEndY);
        let chunks = [];
        for (let x = chunkStartX; x <= chunkEndX; x++) {
            for (let y = chunkStartY; y <= chunkEndY; y++) {
                let chunk = this.getChunkForChunkPosition(x, y);
                if (chunk !== null) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }
    getChunkForChunkPosition(chunkX, chunkY, createNew = false) {
        let column = this.tileChunks.get(chunkX);
        if (column === undefined) {
            if (createNew === true) {
                column = new Map();
                this.tileChunks.set(chunkX, column);
            } else {
                return null;
            }
        }
        let chunk = column.get(chunkY);
        if (chunk === undefined) {
            if (createNew === true) {
                chunk = new TileChunk(chunkX, chunkY, Chunk_Width, Chunk_Height);
                column.set(chunkY, chunk);
            } else {
                return null;
            }
        }
        return chunk;
    }
    getChunkForTile(tileX, tileY, createNew = false) {
        let chunkX = this.convertTileXToChunkX(tileX);
        let chunkY = this.convertTileYToChunkY(tileY);
        return this.getChunkForChunkPosition(chunkX, chunkY, createNew);
    }
    getTile(tileX, tileY, createNew = false) {
        let chunk = this.getChunkForTile(tileX, tileY, createNew);
        if (chunk === null) {
            return null;
        }
        return chunk.getTile(tileX, tileY, createNew);
    }
    setTile = (tileX, tileY, typeID, r, g, b, a) => {
        let chunk = this.getChunkForTile(tileX, tileY, true);
        chunk.setTile(tileX, tileY, typeID, r, g, b, a);
    };
    updateChunk = (chunkX, chunkY, tileData) => {
        let chunk = this.getChunkForChunkPosition(chunkX, chunkY, true);
        for (let tileInfo of tileData) {
            chunk.setTile(tileInfo['x'], tileInfo['y'], tileInfo['typeID'], tileInfo['r'], tileInfo['g'], tileInfo['b'], tileInfo['a']);
        }
    };
}