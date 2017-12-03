import {Player} from "../Player/Player";
import {GameMessageCreator, GameMessageCreator as MsgCreator} from "../Networking/Game/GameMessageCreator";
import {MessageWriter} from "../Utility/MessageWriter";
import {Utility} from "../Utility/Utility";
import {NetworkHandler} from "../Networking/NetworkHandler";
import {Query} from "../Database/Query";
import {Board} from "./Game/Board";
import {Stopwatch} from "../Utility/Stopwatch";
import {TileUpdateQueue} from "./Game/TileUpdateQueue";
import {Benchmark} from "../Utility/Benchmark";
import {NanoTimer} from "../Utility/Nanotimer";
const MsgHandler = require("./../Networking/Game/GameMessageHandler").GameMessageHandler;

export class GameLogic {
    server: any;
    boards: Map<number, Board>;
    flushDBTilesStopwatch: Stopwatch;

    logicLoopBenchmark: Benchmark;
    logicLoopRestartBenchmark: Benchmark;

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
        //Load all boards
        Query.GetAllBoards().then((boards) => {
            for (let board of boards) {
                let boardName = board['name'];
                let boardID = board['board_id'];
                this.boards.set(boardID, new Board(boardID, () => {}));
            }
        });

        this.logicLoopTimer = new NanoTimer(this.logic, 1000.0/60.0);
        this.logicLoopTimer.start();

        this.logicLoopBenchmark = new Benchmark('Logic Processing');
        this.logicLoopRestartBenchmark = new Benchmark('Logic Loop Consistency');
        this.logicLoopRestartBenchmark.start();
    }
    logic = (delta) => {
        this.logicLoopRestartBenchmark.stop();
        this.logicLoopRestartBenchmark.start();
        this.logicLoopRestartBenchmark.prettyPrintAtInterval(5, 5);

        this.logicLoopBenchmark.start();

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

        this.logicLoopBenchmark.stop();
        this.logicLoopBenchmark.prettyPrintAtInterval(5, 5);
    };
    handleRequestBoardSwitchMessage = async(player: Player, boardID: number) => {
        this.switchPlayerToBoard(player, boardID);
    };

    handleSpriteChangeMessage = async(player: Player, spriteID: number) => {
        player.getAccountData().setSpriteID(spriteID);
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
    };
    handleMovingRightMessage = async(player: Player, moving: boolean) => {
        player.getGameData().setMovingRight(moving);
    };
    handleJumpingMessage = async(player: Player, moving: boolean) => {
        player.getGameData().setJumping(moving);
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