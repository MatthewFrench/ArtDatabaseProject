import {Player} from "../Player/Player";
import {GameMessageCreator} from "../Networking/Game/GameMessageCreator";
import {NetworkHandler} from "../Networking/NetworkHandler";
import {Query} from "../Database/Query";
import {Board} from "./Game/Board";
import {Stopwatch} from "../Utility/Stopwatch";
import {TileUpdateQueue} from "./Game/TileUpdateQueue";
import {Benchmark} from "../Utility/Benchmark";
import {NanoTimer} from "../Utility/Nanotimer";
import {AdminTools} from "./Game/AdminTools";
const MsgHandler = require("./../Networking/Game/GameMessageHandler").GameMessageHandler;

export class GameLogic {
    server: any;
    boards: Map<number, Board>;
    flushDBTilesStopwatch: Stopwatch;

    logicLoopTimer: NanoTimer;

    constructor(server) {
        this.server = server;
        this.boards = new Map();
        this.flushDBTilesStopwatch = new Stopwatch();
        MsgHandler.AddNewCreateWorldListener(this.handleNewCreateWorldMessage);
        MsgHandler.AddMovingLeftListener(this.handleMovingLeftMessage);
        MsgHandler.AddRequestBoardSwitchListener(this.handleRequestBoardSwitchMessage);
        MsgHandler.AddSpriteChangeListener(this.handleSpriteChangeMessage);
        MsgHandler.AddSetTileListener(this.handleSetTileMessage);
        MsgHandler.AddMovingRightListener(this.handleMovingRightMessage);
        MsgHandler.AddJumpingListener(this.handleJumpingMessage);
        MsgHandler.AddLoadFullWorldListener(this.handleLoadFullWorldMessage);
        //Load all boards
        Query.GetAllBoards().then((boards) => {
            for (let board of boards) {
                let boardName = board['name'];
                let boardID = board['board_id'];
                this.boards.set(boardID, new Board(boardID, () => {}));
            }
        });

        //AdminTools.HardCoreRevertCauseIScrewedUp().then();

        this.logicLoopTimer = new NanoTimer(this.logic, 1000.0/60.0);
        this.logicLoopTimer.start();
    }
    logic = (delta) => {
        for (let [boardID, board] of this.boards) {
            board.logic(delta);
        }
        if (this.flushDBTilesStopwatch.getMinutes() >= 2) {
            TileUpdateQueue.FlushTileUpdateQueue().then();
            this.flushDBTilesStopwatch.reset();
        }
        //Flush networking for all players
        for (let [_, player] of NetworkHandler.GetPlayers()) {
            player.flushSendQueue();
        }
    };

    handleLoadFullWorldMessage = async(player: Player) => {
        if (player.getGameData().getCurrentBoardID() === -1) {
            return;
        }
        player.getGameData().getCurrentBoard().tileWorld.sendAllChunksToPlayer(player);
    };

    handleRequestBoardSwitchMessage = async(player: Player, boardID: number) => {
        this.switchPlayerToBoard(player, boardID);
    };

    handleSpriteChangeMessage = async(player: Player, spriteID: number) => {
        player.getAccountData().setSpriteID(spriteID);
        Query.SetPlayerSprite(player.getAccountData().getPlayerID(), spriteID).then();
    };

    handleSetTileMessage = async(player: Player, x: number, y: number, typeID: number,
                                 r: number, g: number, b: number, a: number) => {
        let board = player.getGameData().getCurrentBoard();
        if (board !== null) {
            board.addOrUpdateTile(x, y, r, g, b, a, typeID, player);
        }
    };
    handleMovingLeftMessage = async (player: Player, moving: boolean) => {
        player.getGameData().setMovingLeft(moving);
        if (player.getGameData().getCurrentBoard() != null) {
            let board = player.getGameData().getCurrentBoard();
            board.sendToAllPlayersInBoard(GameMessageCreator.UpdatePlayer(player));
        }
    };
    handleMovingRightMessage = async(player: Player, moving: boolean) => {
        player.getGameData().setMovingRight(moving);
        if (player.getGameData().getCurrentBoard() != null) {
            let board = player.getGameData().getCurrentBoard();
            board.sendToAllPlayersInBoard(GameMessageCreator.UpdatePlayer(player));
        }
    };
    handleJumpingMessage = async(player: Player, moving: boolean) => {
        player.getGameData().setJumping(moving);
        if (player.getGameData().getCurrentBoard() != null) {
            let board = player.getGameData().getCurrentBoard();
            board.sendToAllPlayersInBoard(GameMessageCreator.UpdatePlayer(player));
        }
    };

    playerLoggedIn = async (player : Player) => {
        //Send all board information to the selector
        for (let [boardID, board] of this.boards) {
            player.send(GameMessageCreator.UpdateSelectorBoard(boardID,
                board.getName(), board.getNumberOfPlayers(), board.getLastModifiedDate(),
                board.getTileCount()));
        }
        //Get previous board location
        let locationData = await Query.GetPlayerLocation(player.getAccountData().getPlayerID());
        let sendToBoard = 1;
        let sendToX = 0;
        let sendToY = 0;
        if (locationData !== null) {
            sendToX = locationData['location_x'];
            sendToY = locationData['location_y'];
            sendToBoard = locationData['board_id'];
        }

        //Assign the player to a board
        this.switchPlayerToBoard(player, sendToBoard, sendToX, sendToY);


        //await AdminTools.HardCoreRevertCauseIScrewedUp();
/*
        let badTiles1 = await Query.GetAllGriefedTiles();
        console.dir(badTiles1);

        //Get stuff
        let lastGoodHistory = await Query.GetLastGoodHistoryForGriefedTiles();
        console.dir(lastGoodHistory);
        for (let historyRow of lastGoodHistory) {
            let boardID = historyRow['board_id'];
            let r = historyRow['color_r'];
            let g = historyRow['color_g'];
            let b = historyRow['color_b'];
            let a = historyRow['color_a'];
            let x = historyRow['x'];
            let y = historyRow['y'];
            let typeID = historyRow['type_id'];
            let playerID = historyRow['player_id'];
            await TileUpdateQueue.AddTileUpdateToQueue(boardID, x, y, r, g, b, a, playerID, typeID);
        }
        await TileUpdateQueue.FlushTileUpdateQueue();
        console.dir(lastGoodHistory);

        //Now reset the rest of the tiles
        let badTiles = await Query.GetAllGriefedTiles();
        console.dir(badTiles);
*/
    };
    playerDisconnected = async (player : Player) => {
        //Save the player board and location if he was in a board

        if (player.getGameData().getCurrentBoard() !== null) {
            player.getGameData().getCurrentBoard().removePlayer(player);
        }
    };
    getBoardByID = (boardID) => {
        if (!this.boards.has(boardID)) {
            return null;
        }
        return this.boards.get(boardID);
    };
    switchPlayerToBoard = (player: Player, boardID = 1, x = 0, y = 0) => {
        let board = this.getBoardByID(boardID);
        if (board === null) {
            //Set default board
            if (this.boards.size > 0) {
                board = this.boards.values().next().value;
            }
        }
        if (player.getGameData().getCurrentBoard() !== null) {
            player.getGameData().getCurrentBoard().removePlayer(player);
        }
        player.getGameData().setSpeedX(0);
        player.getGameData().setSpeedY(0);
        player.getGameData().setX(x);
        player.getGameData().setY(y);
        if (board !== null) {
            board.addPlayer(player);
        }
    };
    handleNewCreateWorldMessage = async(player: Player, worldName: string) => {
        let boardID = await Query.CreateBoard(worldName, player.getAccountData().getPlayerID());
        //Create basic line at the bottom to catch players
        for (let x = -5; x < 5; x++) {
            await Query.UpdateOrInsertTile(boardID, x, 0, 0, 0, 0, 255,
                player.getAccountData().getPlayerID(), 4);
            //Tile id of 4 as solid for starting
        }
        let boardInfo = await Query.GetBoardByID(boardID);
        let boardName = boardInfo['name'];
        let board = new Board(boardID, ()=>{
            this.boards.set(boardID, board);

            //Send board selector update message
            let message = GameMessageCreator.UpdateSelectorBoard(boardID,
                boardName, board.getNumberOfPlayers(), board.getLastModifiedDate(),
                board.getTileCount());
            NetworkHandler.SendToAllLoggedIn(message);
            this.switchPlayerToBoard(player, boardID);
        });
    };
}