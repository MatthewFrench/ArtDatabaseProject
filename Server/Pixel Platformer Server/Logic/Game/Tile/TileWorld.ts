import {TileChunk} from "./TileChunk";
import {Player} from "../../../Player/Player";

const Chunk_Width = 25;
const Chunk_Height = 25;

const Chunk_Sight_Range_Enter_Radius = 4;
const Chunk_Sight_Range_Leave_Radius = 8;

/**
 * Holds all the tile chunks
 */
export class TileWorld {
    tileChunks: Map<number, Map<number, TileChunk>>;
    tileCount = 0;
    playersInWorld : Player[];
    playerChunkSightConnections : Map<Player, TileChunk[]>;
    boardID;
    constructor(boardID) {
        this.boardID = boardID;
        //X is tile chunk X, so chunk at X 1 will be so much tiles from origin defined above.
        //Tile format: [chunkX][chunkY] = Tile
        this.tileChunks = new Map();
        this.playerChunkSightConnections = new Map();
        this.playersInWorld = [];
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
        return this.getChunksInChunkRange(chunkStartX, chunkStartY, chunkEndX, chunkEndY);
    }
    getChunksInChunkRange(chunkStartX, chunkStartY, chunkEndX, chunkEndY) {
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
                this.updatePlayerSightWithNewChunk(chunk);
            } else {
                return null;
            }
        }
        return chunk;
    }
    getChunkForTile(tileX, tileY, createNew = false) : TileChunk {
        let chunkX = this.convertTileXToChunkX(tileX);
        let chunkY = this.convertTileYToChunkY(tileY);
        return this.getChunkForChunkPosition(chunkX, chunkY, createNew);
    }
    getTile(tileX, tileY) {
        let chunk = this.getChunkForTile(tileX, tileY);
        if (chunk === null) {
            return null;
        }
        return chunk.getTile(tileX, tileY);
    }
    setTile = (boardID, typeID, tileX, tileY ,r, g, b, a, creatorID, lastModifiedID) => {
        let chunk = this.getChunkForTile(tileX, tileY, true);
        this.tileCount -= chunk.getTileCount();
        let tile = chunk.setTile(boardID, typeID, tileX, tileY ,r, g, b, a, creatorID, lastModifiedID);
        this.tileCount += chunk.getTileCount();
        return tile;
    };
    getTileCount = () => {
        return this.tileCount;
    };

    private updatePlayerSight = (player : Player) => {
        if (player.getGameData().getCurrentBoardID() !== this.boardID) {
            this.removePlayerSight(player);
            return;
        }
        let playerChunkX = Math.floor(player.getGameData().getX() / Chunk_Width);
        let playerChunkY = Math.floor(player.getGameData().getY() / Chunk_Height);
        if (playerChunkX === player.getGameData().getCurrentChunkX() &&
            playerChunkY === player.getGameData().getCurrentChunkY()) {
            return;
        }
        player.getGameData().setCurrentChunkX(playerChunkX);
        player.getGameData().setCurrentChunkY(playerChunkY);
        let currentChunks : TileChunk[] = [];
        if (this.playerChunkSightConnections.has(player)) {
            currentChunks = this.playerChunkSightConnections.get(player);
        }
        //Remove player from out of range chunks
        for (let chunkIndex = 0; chunkIndex < currentChunks.length; chunkIndex++) {
            let chunk = currentChunks[chunkIndex];
            if (Math.hypot(chunk.getChunkX() - playerChunkX,
                    chunk.getChunkY() - playerChunkY) > Chunk_Sight_Range_Leave_Radius) {
                chunk.removePlayerInSight(player);
                currentChunks.splice(chunkIndex, 1);
                chunkIndex--;
            }
        }
        //Add player to new chunks
        let chunks : TileChunk[] = this.getChunksInChunkRange(
            playerChunkX - Chunk_Sight_Range_Enter_Radius,
            playerChunkY - Chunk_Sight_Range_Enter_Radius,
            playerChunkX + Chunk_Sight_Range_Enter_Radius,
            playerChunkY + Chunk_Sight_Range_Enter_Radius);
        for (let chunk of chunks) {
            if (Math.hypot(chunk.getChunkX() - playerChunkX,
                        chunk.getChunkY() - playerChunkY) <= Chunk_Sight_Range_Enter_Radius) {
                if (currentChunks.indexOf(chunk) === -1) {
                    currentChunks.push(chunk);
                    this.sendChunkDataToPlayer(chunk, player);
                    chunk.addPlayerInSight(player);
                }
            }
        }
        this.playerChunkSightConnections.set(player, currentChunks);
    };
    private removePlayerSight = (player: Player) => {
        let previousChunks = [];
        if (this.playerChunkSightConnections.has(player)) {
            previousChunks = this.playerChunkSightConnections.get(player);
        }
        for (let chunk of previousChunks) {
            chunk.removePlayerInSight(player);
        }
        this.playerChunkSightConnections.delete(player);
    };
    private updatePlayerSightWithNewChunk(chunk: TileChunk) {
        for (let player of this.playersInWorld) {
            let playerChunkX = Math.floor(player.getGameData().getX() / Chunk_Width);
            let playerChunkY = Math.floor(player.getGameData().getY() / Chunk_Height);
            if (Math.abs(chunk.getChunkX() - playerChunkX) <= Chunk_Sight_Range_Enter_Radius &&
                Math.abs(chunk.getChunkY() - playerChunkY) <= Chunk_Sight_Range_Enter_Radius) {
                let currentChunks = [];
                if (this.playerChunkSightConnections.has(player)) {
                    currentChunks = this.playerChunkSightConnections.get(player);
                }
                currentChunks.push(chunk);
                this.playerChunkSightConnections.set(player, currentChunks);
                chunk.addPlayerInSight(player);
                this.sendChunkDataToPlayer(chunk, player);
            }
        }
    }

    private sendChunkDataToPlayer = (chunk, player) => {
        chunk.sendTilesToPlayer(player);
    };

    public runPlayerSightCalculations = () => {
        for (let player of this.playersInWorld) {
            this.updatePlayerSight(player);
        }
    };

    public addPlayerToWorld = (player: Player) => {
        this.playersInWorld.push(player);
        //Set player chunk to null
        player.getGameData().setCurrentChunkX(null);
        player.getGameData().setCurrentChunkY(null);
        this.updatePlayerSight(player);
    };
    public removePlayerFromWorld = (player: Player) => {
        let playerIndex = this.playersInWorld.indexOf(player);
        if (playerIndex !== -1) {
            this.playersInWorld.splice(playerIndex, 1);
        }
        this.removePlayerSight(player);
    }
}