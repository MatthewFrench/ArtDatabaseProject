import {Hashing} from "../Utility/Hashing";
import {Stopwatch} from "../Utility/Stopwatch";

let {Database} = require("./Database");
const {Configuration} = require("../Configuration");

//This is a static database variable only accessible here.
let databaseInstance = null;

export class Query {
    /**
     * Initialize the database.
     * @constructor
     */
    static Initialize() {
        databaseInstance = new Database(Configuration.GetHost(),
            Configuration.GetPort(),
            Configuration.GetDatabase(),
            Configuration.GetDBUsername(),
            Configuration.GETDBPassword());
    }

    static async UseConnection(callback) {
        let connection = null;
        let success = false;
        try {
            //Get a connection
            connection = await databaseInstance.getConnection();
            try {
                await callback(connection);
                success = true;
            } finally {
                //Release the connection
                connection.release();
            }
        } catch (err) {
            connection.destroy();
            //Assume the entire pool has been compromised
            databaseInstance.resetConnectionPool();
            console.log(err);
            console.log(err.stack);
            success = false;
        }
        return success;
    }

    static async GetSprites() {
        let result = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "SELECT * FROM Sprites";
            //Execute Query
            [result] = await connection.query(sql, []);
        });
        return result;
    }

    /****** TILE QUERIES ******/
    /**  GetAllTiles
     * Retrieves all "tile information."
     * (Params) - boardID
     * (Returns) - all “tile information” for the board
     */
    static async GetAllTiles(boardID) {
        let results = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select Tile.*, TileType.type_id as type_id from Tile " +
                "left join TileType on TileType.tile_id = Tile.tile_id " +
                "where board_id = ?";
            //Execute Query
            [results] = await connection.query(sql, [boardID]);
            //Release the connection
            connection.release();
        });
        //Pass back results
        return results;
    }

    /**  UpdateOrInsertTile
     * After changing a tile in local memory, send the
     * update information to the board’s database.
     */
    static async UpdateOrInsertTile(boardID, x, y,
                         r, g, b, a,
                         creatorOrLastModifiedID, tileTypeID) {
        let tileID = -1;
        await Query.UseConnection(async (connection)=>{
            await connection.beginTransaction();
            //Create SQL
            let sql = "insert into Tile (board_id,x,y,color_r,color_g,color_b,color_a," +
                "creator_id,last_modified_id) " +
                "values (?,?,?,?,?,?,?,?,?) " +
                "on duplicate key update color_r = ?, color_g = ?, color_b = ?, color_a = ?, " +
                "last_modified_id = ?";
            let data = [boardID, x, y, r, g, b, a,
                creatorOrLastModifiedID, creatorOrLastModifiedID,
                r, g, b, a, creatorOrLastModifiedID];
            //Execute Query
            try {
                await connection.query(sql, data);
            } catch(err) {
                console.log('SQL error: ' + sql);
                console.log('Data: ' + JSON.stringify(data));
                throw err;
            }
            sql = 'select tile_id from Tile where board_id = ? and x = ? and y = ?';
            data = [boardID, x, y];
            let results;
            try {
                [results] = await connection.query(sql, data);
            } catch(err) {
                console.log('SQL error: ' + sql);
                console.log('Data: ' + JSON.stringify(data));
                throw err;
            }
            //Set the tile type
            tileID = results[0]['tile_id'];
            sql = 'insert into TileType (tile_id, type_id) values (?, ?) ' +
                'on duplicate key update type_id = ?';
            data = [tileID, tileTypeID, tileTypeID];
            try {
                await connection.query(sql, data);
            } catch(err) {
                console.log('SQL error: ' + sql);
                console.log('Data: ' + JSON.stringify(data));
                throw err;
            }

            //Add to history
            let historyID = await Query.SetHistory(connection, new Date(), tileID, creatorOrLastModifiedID, r, g, b, a);
            await Query.SetHistoryTileType(connection, historyID, tileTypeID);
            await connection.commit();
        });
        return tileID;
    }

    /****** PLAYER QUERIES ******/
    /**
     * Get user information.
     */
    static async CreateAccount(displayName, username, password, email) {
        let success = false;
        await Query.UseConnection(async (connection)=>{
            let encryptedPassword = await Hashing.hashString(password);
            await connection.beginTransaction();
            //Create SQL
            let sql = "Select * from Players where username = ?";
            let [results] = await connection.query(sql, [username]);
            if (results.length > 0) {
                await connection.rollback();
                connection.release();
                return;
            }

            sql = "INSERT INTO Players (display_name, username, encrypted_password, email, sprite_id) VALUES (?, ?, ?, ?, ?)";
            await connection.query(sql, [displayName, username, encryptedPassword, email, 1]);
            await connection.commit();
            success = true;
        });
        return success;
    }

    /**
     *User Login
     */
    static async UserLogin(username, password) : Promise<{}> {
        let account = null;
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select * from Players where username = ?";

            let [results] = await connection.query(sql, [username, password]);
            connection.release();

            if (results.length === 0) {
                return;
            }
            let result = results[0];
            //Check password
            if (!await Hashing.compareStringToHashedString(password, result['encrypted_password'])) {
                return;
            }
            account = result;
        });
        //Release the connection
        return account;
    }

    /**  SetPlayerLocation
     * Periodically store the coordinate location as well as
     * the board number of the player/s.
     * (Params) - playerID, x, y, boardID
     * (Returns) - boolean
     */
    static async SetPlayerLocation(playerID, x, y, boardID) {
        let result = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "insert into PlayerLocation(player_id,board_id,location_x,location_y) values (?,?,?,?) on duplicate key update location_y = ? AND location_x =? and board_id = ?";
            //Execute Query
            [result] = await connection.query(sql, [playerID, boardID, x, y, y, x, boardID]);
        });
        //Pass back results
        return result;
    }

    /**    GetPlayerLocation
     * Retrieve last known player location and board.
     * (Params) - playerID
     * (Returns) - x, y, boardID
     */

    static async GetPlayerLocation(playerID) {
        let returnResult = {};
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select board_id, location_x, location_y from PlayerLocation where player_id = ?";
            //Execute Query
            let [result] = await connection.query(sql, [playerID]);
            //Release the connection
            connection.release();
            if (result.length === 0) {
                return null;
            }
            returnResult = result[0];
        });
        //Pass back results
        return returnResult;
    }

    /**    SetPlayerSprite
     * Replaces any existing sprite for a player with
     * a new sprite.
     * (Params) - playerID, spriteID
     * (Returns) - boolean
     */

    static async SetPlayerSprite(playerID, spriteID) {
        let result = {};
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "update Players set sprite_id = ? where player_id = ?";
            //Execute Query
            [result] = await connection.query(sql, [spriteID, playerID]);
        });
        //Pass back results
        return result;
    }

    /**    GetPlayerSprite
     * Finds the sprite of a given player.
     * (Params) - playerID
     * (Returns) - spriteName
     */
    static async GetPlayerSprite(playerID) {
        let result = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select sprite_id from Players where player_id = ?";
            //Execute Query
            [result] = await connection.query(sql, [playerID]);
        });
        //Pass back results
        return result;
    }

    /**    UpdateDisplayName
     * Updates a given player’s display name
     * (Params) - playerID, newName
     * (Returns) - boolean
     */
    static async UpdateDisplayName(playerID, newName) {
        let result = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "update Players set display_name = ? where player_id = ?";
            //Execute Query
            [result] = await connection.query(sql, [newName, playerID]);
        });
        //Pass back results
        return result;
    }

    /**    UpdatePassword
     * Updates a given player’s password
     * (Params) - playerID, newHashedPassword
     * (Returns) - boolean
     */
    static async UpdatePassword(playerID, updatePassword) {
        let result = {};
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "update Players set encrypted_password = ? where player_id = ?";
            //Execute Query
            [result] = await connection.query(sql, [updatePassword, playerID]);
        });
        //Pass back results
        return result;
    }

    /****** BOARD QUERIES ******/

    /**  CreateBoard
     * Creates a new board table in the database.
     * (Params) - boardID, boardName, playerID
     * (Returns) - boolean
     */
    static async CreateBoard(boardName, playerID) : Promise<number> {
        let insertID = -1;
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "insert into Board(name, creator_id) values (?,?)";
            let data = [boardName, playerID];
            //Execute Query
            let results, fields;
            try {
                [results, fields] = await connection.query(sql, data);
            } catch(err) {
                console.log('SQL error: ' + sql);
                console.log('Data: ' + JSON.stringify(data));
                throw err;
            }
            insertID = results.insertId;
        });
        return insertID;
    }

    /**    ChangeBoardName
     *  Change name of board.
     *  (Params)  boardID, newName
     *  (Return)  NULL
     */
    static async ChangeBoardName(boardID, newName) {
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "update Board set name = ? where board_id = ?";
            //Execute Query
            await connection.query(sql, [newName, boardID]);
        });
    }

    /**    RemoveBoard
     *  Remove entry for matching board ID.
     *  (Params) - BoardID
     *  (Returns) - NULL
     */
    static async RemoveBoard(boardId) {
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "update Board set is_deleted = 1 where board_id = ?";
            //Execute Query
            await connection.query(sql, [boardId]);
        });
    }

    static async GetBoardByID(boardID) {
        let boardInfo = null;
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select * from Board where board_id = ?";
            //Execute Query
            let [results] = await connection.query(sql, [boardID]);
            //Pass back results
            if (results.length == 0) {
                return;
            }
            boardInfo = results[0];
        });
        return boardInfo;
    }

    /**
     * Returns all board information.
     * @returns {Promise<any>}
     * @constructor
     */
    static async GetAllBoards() {
        let results = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select * from Board";
            //Execute Query
            [results] = await connection.query(sql, []);
        });
        //Pass back results
        return results;
    }

    /****** SPRITE QUERIES ******/
    /**        GetAllSprites
     * Pull all sprite information to local memory for later loading.
     * (Params) - ????????
     * (Returns) - Array[SpriteInfo]
     */
    static async GetAllSprites() {
        let results = [];
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "Select * from Sprites";
            //Execute Query
            [results] = await connection.query(sql, []);
        });
        //Pass back results
        return results;
    }


    /****** ADMIN QUERIES ******/

    /**        MakeAdmin
     * Adds a player to the admin table.
     * (Params) - playerID
     * (Returns) - boolean
     */
    static async MakeAdmin(playerID, roleDescription) {
        let result = {};
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "insert into Admin(player_id, role_description) values (?,?)";
            //Execute Query
            [result] = await connection.query(sql, [playerID, roleDescription]);
        });
        //Pass back results
        return result;
    }

    /**        RemoveAdmin
     * Adds a player to the admin table.
     * (Params) - playerID
     * (Returns) - boolean
     */
    static async RemoveAdmin(playerID) {
        let results = {};
        await Query.UseConnection(async (connection)=>{
            //Create SQL
            let sql = "delete from Admin where player_id = ?";
            //Execute Query
            [results] = await connection.query(sql, [playerID]);
        });
        //Pass back results
        return results;
    }

    /****** HISTORY QUERIES ******/
    /**        SetHistory
     * Inserts into the History table
     * (Params) - historyID, date_time, tile_id, player_id, color
     * (Returns) - boolean
     */
    static async SetHistory(connection, dateTime, tileID, playerID, r, g, b, a) {
        //Create SQL
        let sql = "insert into History(date_time, tile_id, player_id, color_r, color_g, color_b, color_a) values (?,?,?,?,?,?,?)";
        //Execute Query
        let [result] = await connection.query(sql, [dateTime, tileID, playerID, r, g, b, a]);
        //Pass back results
        return result['insertId'];
    }
    static async SetHistoryTileType(connection, historyID, tileType) {
        //Create SQL
        let sql = "insert into HistoryTileType(history_id, type_id) values (?,?)";
        //Execute Query
        let [result] = await connection.query(sql, [historyID, tileType]);
        //Pass back results
        return result;
    }

    static async BatchUpdateTileColors(connection, tileDataQueueList) {
        let justTileStopwatch = new Stopwatch();
        let data = [];
        for (let tileData of tileDataQueueList) {
            let boardID = tileData['boardID'];
            let x = tileData['x'];
            let y = tileData['y'];
            let r = tileData['r'];
            let g = tileData['g'];
            let b = tileData['b'];
            let a = tileData['a'];
            let creatorOrLastModifiedID = tileData['creatorOrLastModifiedID'];

            data.push([boardID, x, y, r, g, b, a,
                creatorOrLastModifiedID, creatorOrLastModifiedID]);
        }

        //Create SQL
        let sql = "insert into Tile (board_id,x,y,color_r,color_g,color_b,color_a," +
            "creator_id,last_modified_id) " +
            "values ? " +
            "on duplicate key update color_r = VALUES(color_r), color_g = VALUES(color_g), " +
            "color_b = VALUES(color_b), color_a = VALUES(color_a), " +
            "last_modified_id = VALUES(last_modified_id)";

        //Execute Query
        try {
            await connection.query(sql, [data]);
        } catch (err) {
            console.log('SQL error: ' + sql);
            console.log('Data: ' + JSON.stringify(data));
            throw err;
        }
        console.log('Inserting Just Tiles: ' + Math.round(justTileStopwatch.getMilliseconds()) + 'ms');
    }

    public static async BatchUpdateTileTypes(connection, tileDataQueueList) {
        let tileTypeStopwatch = new Stopwatch();

        let tileTypeSQL = '';
        let tileTypeData = [];
        for (let tileData of tileDataQueueList) {
            let boardID = tileData['boardID'];
            let x = tileData['x'];
            let y = tileData['y'];
            let tileTypeID = tileData['tileTypeID'];
            tileTypeSQL += 'INSERT INTO TileType(tile_id, type_id) ' +
                'SELECT tile_id, ? ' +
                'FROM Tile WHERE Tile.x = ? and Tile.y = ? and Tile.board_id = ? ' +
                'ON DUPLICATE KEY UPDATE type_id=VALUES(type_id); ';
            tileTypeData.push(tileTypeID, x, y, boardID);
        }
        try {
            await connection.query(tileTypeSQL, tileTypeData);
        } catch (err) {
            console.log('SQL error: ' + tileTypeSQL);
            console.log('Data: ' + JSON.stringify(tileTypeData));
            throw err;
        }

        console.log('Setting Tile Types: ' + Math.round(tileTypeStopwatch.getMilliseconds()) + 'ms');
    }
    static async BatchInsertHistoryAndHistoryType(connection, tileDataQueueList) {
        let historyStopwatch = new Stopwatch();

        let historySQL = '';
        let historyData = [];
        for (let tileData of tileDataQueueList) {
            let boardID = tileData['boardID'];
            let x = tileData['x'];
            let y = tileData['y'];
            let r = tileData['r'];
            let g = tileData['g'];
            let b = tileData['b'];
            let a = tileData['a'];
            let tileTypeID = tileData['tileTypeID'];
            let modifiedTime = tileData['time'];
            let creatorOrLastModifiedID = tileData['creatorOrLastModifiedID'];
            historySQL += 'INSERT INTO History(tile_id, date_time, player_id, color_r, color_g, color_b, color_a) ' +
                'SELECT tile_id, ?, ?, ?, ?, ?, ? ' +
                'FROM Tile WHERE Tile.x = ? and Tile.y = ? and Tile.board_id = ?; ';
            historySQL += 'INSERT INTO HistoryTileType(history_id, type_id) ' +
                '  VALUES(LAST_INSERT_ID(), ?); ';
            historyData.push(modifiedTime, creatorOrLastModifiedID, r, g, b, a, x, y, boardID, tileTypeID);
        }
        try {
            await connection.query(historySQL, historyData);
        } catch (err) {
            console.log('SQL error: ' + historySQL);
            console.log('Data: ' + JSON.stringify(historyData));
            throw err;
        }

        console.log('Inserting History: ' + Math.round(historyStopwatch.getMilliseconds()) + 'ms');
    }
}