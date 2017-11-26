import {Player} from "../../Player/Player";
import {Query} from "../../Database/Query";
import {Tile} from "./Tile";
import {Physics} from "./Physics";

export class Board {
    physics : Physics;
    boardID : number;
    players : Map<number, Player>;
    tiles: Map<number, Map<number, Tile>>;
    name: string;
    creatorID: number;
    isDeleted: boolean;
    maxWidth: number;
    maxHeight: number;

    constructor(boardID) {
        this.boardID = boardID;
        this.players = new Map();
        this.tiles = new Map();
    }

    loadBoardInfo = async() => {
        let boardInfo = Query.GetBoardByID(this.boardID);
        this.name = boardInfo['name'];
        this.creatorID = boardInfo['creator_id'];
        this.isDeleted = boardInfo['is_deleted'] == 1;
        this.maxWidth = boardInfo['max_width'];
        this.maxHeight = boardInfo['max_height'];
    };

    loadTilesFromDatabase = async () => {
        let tileDataArray = await Query.GetAllTiles(this.boardID);
        this.tiles = new Map();
        for (let tileData of tileDataArray) {
            let boardID = tileData["board_id"];
            let tileID = tileData["tile_id"];
            let typeID = tileData["type_id"];
            let x = tileData["x"];
            let y = tileData["y"];
            let r = tileData["color_r"];
            let g = tileData["color_g"];
            let b = tileData["color_b"];
            let a = tileData["color_a"];
            let creatorID = tileData["creator_id"];
            let lastModifiedID = tileData["last_modified_id"];

            let tile = new Tile(boardID, tileID, typeID, x, y ,r, g, b, a, creatorID, lastModifiedID);
            if (!this.tiles.has(x)) {
                this.tiles.set(x, new Map());
            }
            this.tiles.get(x).set(y, tile);
        }
    };

    //Run from logic loop
    logic = () => {
        this.physics.logic();
        //Send moving player locations
        //TODO
    };

    addPlayer = (player : Player) => {
        //Send add player to all players
        this.players.set(player.getAccountData().getPlayerID(), player);
        //Send all existing players to new player
        //Send all tile data to new player (inefficient)
        //TODO
    };

    removePlayer = (player : Player) => {
        this.players.delete(player.getAccountData().getPlayerID());
        //Send remove player to all players
        //TODO
    };

    addOrUpdateTile = (x, y, r, g, b, a, tileType, player: Player) => {
        if (!this.tiles.has(x)) {
            this.tiles.set(x, new Map());
        }
        let tile = this.getTile(x, y);
        if (tile === null) {
            tile = new Tile(-1, this.boardID, tileType, x, y, r, g, b, a,
                player.getAccountData().getPlayerID(), player.getAccountData().getPlayerID());
            this.tiles.get(x).set(y, tile);
        } else {
            tile.setColor(r, g, b, a);
            tile.setLastModifiedID(player.getAccountData().getPlayerID());
            tile.setTypeID(tileType);
        }
        Query.UpdateOrInsertTile(this.boardID, x, y, r, g, b, a,
                player.getAccountData().getPlayerID(), tileType).then((tileID)=>{
            tile.setTileID(tileID);
        });

        //Send updates to nearby players
        //TODO
        //x, y, r, g, b, a, tileType
    };

    sendToAllPlayersInBoard = (binaryMessage) => {
        for (let [playerID, player] of this.players) {
            player.send(binaryMessage);
        }
    };

    getTile = (x, y) => {
        if (!this.tiles.has(x)) {
            return null;
        }
        let tile = this.tiles.get(x).get(y);
        if (tile === undefined) {
            return null;
        }
        return tile;
    };

    getBoardID = () : number => {
        return this.boardID;
    };

    getPlayers = () : Map<number, Player> => {
        return this.players;
    };
}