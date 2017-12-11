import {Player} from "../../Player/Player";
import {Query} from "../../Database/Query";
import {Tile} from "./Tile/Tile";
import {Physics} from "./Physics";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";
import {ChatMessageCreator} from "../../Networking/Chat/ChatMessageCreator";
import {Stopwatch} from "../../Utility/Stopwatch";
import {Network} from "../../Networking/Network";
import {NetworkHandler} from "../../Networking/NetworkHandler";
import {TileUpdateQueue} from "./TileUpdateQueue";
import {TileWorld} from "./Tile/TileWorld";

export class Board {
    physics : Physics;
    boardID : number;
    players : Map<number, Player>;
    name: string = 'Not Loaded';
    creatorID: number;
    isDeleted: boolean;
    maxWidth: number;
    maxHeight: number;
    lastModifiedDate = new Date();
    updatePlayerStopwatch = new Stopwatch();
    tileWorld: TileWorld;

    constructor(boardID, onFinishLoad : () => void) {
        this.physics = new Physics(this);
        this.boardID = boardID;
        this.players = new Map();
        this.tileWorld = new TileWorld(this.boardID);
        this.loadBoardInfo().then(()=>{
            this.loadTilesFromDatabase().then(()=>{
                onFinishLoad();
            });
        });
    }

    loadBoardInfo = async() => {
        let boardInfo = await Query.GetBoardByID(this.boardID);
        this.name = boardInfo['name'];
        this.creatorID = boardInfo['creator_id'];
        this.isDeleted = boardInfo['is_deleted'] == 1;
        this.maxWidth = boardInfo['max_width'];
        this.maxHeight = boardInfo['max_height'];
        console.log('Loading board: ' + this.name);
    };

    loadTilesFromDatabase = async () => {
        let tileDataArray = await Query.GetAllTiles(this.boardID);
        for (let tileData of tileDataArray) {
            let boardID = tileData["board_id"];
            //let tileID = tileData["tile_id"];
            let typeID = tileData["type_id"];
            let x = tileData["x"];
            let y = tileData["y"];
            let r = tileData["color_r"];
            let g = tileData["color_g"];
            let b = tileData["color_b"];
            let a = tileData["color_a"];
            let creatorID = tileData["creator_id"];
            let lastModifiedID = tileData["last_modified_id"];

            let tile = this.tileWorld.setTile(boardID, typeID, x, y ,r, g, b, a, creatorID, lastModifiedID);

            if (this.players.size > 0) {
                this.sendToAllPlayersInBoard(GameMessageCreator.UpdateTile(tile));
            }
        }
        console.log('Finished Loading Tiles for board: ' + this.name);
    };

    //Run from logic loop
    logic = (delta) => {
        this.physics.logic(delta);
        this.tileWorld.runPlayerSightCalculations();
        //Send moving player locations
        if (this.updatePlayerStopwatch.getMilliseconds() >= 1000.0/4.0) { //30
            this.updatePlayerStopwatch.reset();
            for (let [playerID, player] of this.players) {
                this.sendToAllPlayersInBoard(GameMessageCreator.UpdatePlayer(player));
            }
        }
    };

    updateBoardSelectorForThisBoard = () => {
        NetworkHandler.SendToAllLoggedIn(GameMessageCreator.UpdateSelectorBoard(this.boardID,
            this.getName(), this.getNumberOfPlayers(), this.getLastModifiedDate(),
            this.getTileCount()));
    };

    addPlayer = (player : Player) => {
        //Send add player to all players
        this.sendToAllPlayersInBoard(GameMessageCreator.AddPlayer(player));
        player.getGameData().setCurrentBoard(this);
        //Tell the player that it is now in a new board
        player.send(GameMessageCreator.SwitchToBoard(this.boardID));
        this.players.set(player.getAccountData().getPlayerID(), player);
        //Send all existing players to new player
        for (let [playerID, prevPlayer] of this.players) {
            player.send(GameMessageCreator.AddPlayer(prevPlayer));
        }
        //Send self focus
        player.send(GameMessageCreator.FocusPlayer(player));
        //This updates player sight tiles
        this.tileWorld.addPlayerToWorld(player);
        //Send chat message telling the player he switched to a board
        player.send(ChatMessageCreator.AddChatMessage(this.boardID,
            player.getAccountData().getPlayerID(), '<span style="color: red">Server</span>',
            'Entered Board - ' + this.name, new Date()));

        this.updateBoardSelectorForThisBoard();
    };

    removePlayer = (player : Player) => {
        this.tileWorld.removePlayerFromWorld(player);
        this.players.delete(player.getAccountData().getPlayerID());
        //Send remove player to all players
        this.sendToAllPlayersInBoard(GameMessageCreator.RemovePlayer(player));
        player.getGameData().setCurrentBoard(null);

        this.updateBoardSelectorForThisBoard();
    };

    addOrUpdateTile = (x, y, r, g, b, a, tileType, player: Player) => {
        this.lastModifiedDate = new Date();

        let tile = this.tileWorld.setTile(this.boardID, tileType, x, y, r, g, b, a,
            player.getAccountData().getPlayerID(), player.getAccountData().getPlayerID());

        TileUpdateQueue.AddTileUpdateToQueue(this.boardID, x, y, r, g, b, a,
            player.getAccountData().getPlayerID(), tileType);

        let chunk = this.tileWorld.getChunkForTile(x, y);
        let chunkUpdateMessage = GameMessageCreator.UpdateTile(tile)
        for (let player of chunk.getPlayersInSight()) {
            player.send(chunkUpdateMessage);
        }

        this.updateBoardSelectorForThisBoard();
    };

    sendToAllPlayersInBoard = (binaryMessage) => {
        for (let [playerID, player] of this.players) {
            player.send(binaryMessage);
        }
    };

    getTile = (x, y) => {
        return this.tileWorld.getTile(x, y);
    };

    getBoardID = () : number => {
        return this.boardID;
    };

    getPlayers = () : Map<number, Player> => {
        return this.players;
    };

    getName = () => {
        return this.name;
    };

    getNumberOfPlayers = () => {
        return this.players.size;
    };

    getLastModifiedDate = () => {
        return this.lastModifiedDate;
    };

    getTileCount = () => {
        return this.tileWorld.getTileCount();
    };
}