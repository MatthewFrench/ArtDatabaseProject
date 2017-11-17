let mysql = require("mysql2/promise");
let {Database} = require("./Database.js");
const {Configuration} = require("../Configuration.js");

//This will hold every function for querying the database:
//begin transaction
//rollback
//commit
//getUserWithLoginInfo
//updateTimeAtPosition

//This is a static database variable only accessible here.
let databaseInstance = null;

class Query {
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

  //Example queries to setup the others
  static async CreateAccount(username, hashedPassword) {
    let connection = await databaseInstance.getConnection();
    var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    let result = await connection.query(sql, [parameters]);
    console.log("1 record inserted");
    connection.release();

    //let statement = mysql.createQuery("select * FROM Users where user=? and pass=?",
    //  [username, hashedPassword]);
    //Execute on database
    //Get user
    //Return user or null if none
  }

  static async GetAccounts(username, hashedPassword) {
    //let statement = await mysql.createQuery("select * FROM Users where user=? and pass=?",
    //[username, hashedPassword]);
    //Execute on database
    //Get user
    //Return user or null if none

    /*
    databaseInstance.query("SELECT * FROM customers", [parameters], function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
    */
  }

  static async SetDisplayNameOfAccount() {
    /*
        databaseInstance.query('UPDATE user SET first_name = "'+ fName +
          '" WHERE username = "'+username+'"', [parameters], function(err, result){
          console.log('updated user! ' + element.username);
        });
        */
  }

  static async GetSprites() {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "SELECT * FROM Sprites";
    //Execute Query
    let [result, fields] = await connection.query(sql, []);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }

  /* Templates
     - Creating functions: 

    static async TITLE() {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "";
    //Execute Query
    let [result, fields] = await connection.query(sql, []);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }

  */


  /****** TILE QUERIES ******/
  /**  GetAllTiles
   * Retrieves all "tile information."
   * (Params) - boardID
   * (Returns) - all “tile information” for the board
   */
  static async getAllTiles(boardID) {
    //Get a connection
    let connection = databaseInstance.getConnection();
    //Create SQL
    let sql = "Select * from Tile where board_id = ?";
    //Execute Query
    let [results, fields] = connection.query(sql, [boardID]);
    //Release the connection
    connection.release();
    //Pass back results
    return results;
  }

  /**  SetTile
   * After changing a tile in local memory, send the
   * update information to the board’s database.
   *  (Params) - tileID, boardID, x, y, color, creatorID, lastModifiedID
   * (Returns) - boolean
   */
  static async setTile(tileID, boardID, x, y, color, creatorID, lastModifiedID) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "insert into Tile (tile_id,board_id,x,y,color,creator_id, last_modified_id) values (?,?,?,?,?,?,?) on duplicate key update color = ?";
    //Execute Query
    await connection.query(sql, [tileID, boardID, x, y, color, creatorID, lastModifiedID, color]);
    //Release connection
    connection.release();
  }

  /****** PLAYER QUERIES ******/
  /**
   * Get user information.
   * @param username
   * @param hashedPassword
   * @constructor
   */
  static async createAccount(displayName, username, pw, email)
  {
 
      let connection = await databaseInstance.getConnection();
      await connection.beginTransaction();
      //Create SQL
      let sql = "Select * from Players where username = ?";
      let results = await connection.query(sql, [username] );
      if(results.length > 0)
      {
      await connection.rollback();
      connection.release();
      return false;
      }

      let sql = "INSERT INTO Players (display_name, username, encrypted_password, sprite_id) VALUES (?, ?, ?, 1)";
      await connection.query(sql, [displayName, username, encrypted_password]);
      await connection.commit();
              //Release the connection
              connection.release();
      return true; 
 
  }
  
  /**
  *User Login
  *
  *
  *
  */
  static userLogin(signin, pw)
  {
      let connection = await databaseInstance.getConnection();
      //Create SQL
      let sql = "Select * from Players where username = ? and encrypted_password = ?";
      
      let results = await connection.query(sql, [signin, pw]);
      
      if(results.length == 0)
      {
      return null;
      }
      //Release the connection
      connection.release();
      return results[0];
  }

  /**  SetPlayerLocation
   * Periodically store the coordinate location as well as
   * the board number of the player/s.
   * (Params) - playerID, x, y, boardID
   * (Returns) - boolean
   */
  static async setPlayerLocation(playerID, x, y, boardID) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "insert into PlayerLocation(player_id,board_id,location_x,location_y) values (?,?,?,?) on duplicate key update location_y = ? AND location_x =? and board_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [playerID, boardID, x, y, y, x, boardID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }

  /**    GetPlayerLocation
   * Retrieve last known player location and board.
   * (Params) - playerID
   * (Returns) - x, y, boardID
   */

  static async getPlayerLocation(playerID) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "Select board_id, location_x, location_y from PlayerLocation where player_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [playerID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }
  /**    SetPlayerSprite
   * Replaces any existing sprite for a player with
   * a new sprite.
   * (Params) - playerID, spriteID
   * (Returns) - boolean
   */

  static async setPlayerSprite(playerID, spriteID) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "update Players set sprite_id = ? where player_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [spriteID,playerID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }
  /**    GetPlayerSprite
   * Finds the sprite of a given player.
   * (Params) - playerID
   * (Returns) - spriteName
   */

  static async getPlayerSprite(playerID) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "Select sprite_id from Players where player_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [playerID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }
  /**    UpdateDisplayName
   * Updates a given player’s display name
   * (Params) - playerID, newName
   * (Returns) - boolean
   */

  static async updateDisplayName(playerID, newName) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "update Players set display_name = ? where player_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [newName, playerID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }
  /**    UpdatePassword
   * Updates a given player’s password
   * (Params) - playerID, newHashedPassword
   * (Returns) - boolean
   */

  static async updatePassword(playerID,updatePassword) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "update Players set encrypted_password = ? where player_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [updatePassword, playerID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }
  /****** BOARD QUERIES ******/

  /**  CreateBoard
   * Creates a new board table in the database.
   * (Params) - boardID, boardName, playerID
   * (Returns) - boolean
   */


  static async createBoard(boardID, boardName, playerID) {
    //Get a connection
    let connection = databaseInstance.getConnection();
    //Create SQL
    let sql = "insert into Board(board_id, name, creator_id) values (?,?,?)";
    //Execute Query
    await connection.query(sql, [boardID, boardName, playerID]);
    //Release the connection
    connection.release();
  }

  /**    ChangeBoardName
   *  Change name of board.
   *  (Params)  boardID, newName
   *  (Return)  NULL
   */
  static async changeBoardName(boardID, newName) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "update Board set name = ? where board_id = ?";
    //Execute Query
    await connection.query(sql, [newName, boardID]);
    //Release connection
    connection.release();
  }

  /**    RemoveBoard
   *  Remove entry for matching board ID.
   *  (Params) - BoardID
   *  (Returns) - NULL
   */
  static async removeBoard(boardId) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "update Board set is_deleted = 1 where board_id = ?";
    //Execute Query
    await connection.query(sql, [board_id]);
    //Release the connection
    connection.release();
  }
			/****** SPRITE QUERIES ******/
/**		GetAllSprites
* Pull all sprite information to local memory for later loading.
* (Params) - ????????
* (Returns) - Array[SpriteInfo]
*/
static async getAllSprites() {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "Select * from Sprites";
    //Execute Query
    let [result, fields] = await connection.query(sql, []);
    //Release the connection
    connection.release();
    //Pass back results
       return result;
      }
    

			/****** ADMIN QUERIES ******/
/**		MakeAdmin
* Adds a player to the admin table.
* (Params) - playerID
* (Returns) - boolean
*/
static async makeAdmin(playerID, roleDescription) {
  //Get a connection
  let connection = await databaseInstance.getConnection();
  //Create SQL
  let sql = "insert into Admin(player_id, role_description) values (?,?)";
  //Execute Query
  let [result, fields] = await connection.query(sql, [playerID, roleDescription]);
  //Release the connection
  connection.release();
    //Pass back results
    return result;
  }

/**		RemoveAdmin
* Adds a player to the admin table.
* (Params) - playerID
* (Returns) - boolean
*/
  static async removeAdmin(playerID) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "delete from Admin where player_id = ?";
    //Execute Query
    let [result, fields] = await connection.query(sql, [playerID]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }

			/****** HISTORY QUERIES ******/
/**		SetHistory
* Inserts into the History table
* (Params) - historyID, date_time, tile_id, player_id, color
* (Returns) - boolean
*/
  static async setHistory(historyID, dateTime, tileID, playerID, color) {
    //Get a connection
    let connection = await databaseInstance.getConnection();
    //Create SQL
    let sql = "insert into History(history_id, date_time, tile_id, player_id, color) values (?,?,?,?,?)";
    //Execute Query
    let [result, fields] = await connection.query(sql, [historyID, dateTime,tileID, playerID, color]);
    //Release the connection
    connection.release();
    //Pass back results
    return result;
  }

}

exports.Query = Query;
