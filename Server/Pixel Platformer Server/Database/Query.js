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

  static TITLE() {
    //Get a connection
    databaseInstance.getConnection((connection)=>{
      //Create SQL
      let sql = "";
      //Execute Query
      connection.query(sql, [], function (err, result) {
        //Crash on error
        if (err) console.log('Error: ' + err);
        //Release the connection
        connection.release();
        //Pass back results
        resultCallback(result);
      });
    });
  }

  */



  /****** TILE QUERIES ******/
  /**	GetAllTiles
  * Retrieves all "tile information."
  * (Params) - boardID
  * (Returns) - all “tile information” for the board
  */
    static getAllTiles(boardID) {
      //Get a connection
      databaseInstance.getConnection((connection)=>{
        //Create SQL
        let sql = "Select * from Tile where board_id = ? ";
        //Execute Query
        connection.query(sql, [boardID], function (err, result) {
          //Crash on error
          if (err) console.log('Error: ' + err);
          //Release the connection
          connection.release();
          //Pass back results
          resultCallback(result);
        });
      });
    }
  
  /**	SetTile
  * After changing a tile in local memory, send the
  * update information to the board’s database.
  *  (Params) - tileID, boardID, x, y, color, creatorID, lastModifiedID
  * (Returns) - boolean
  */
    static setTile(tileID, boardID, x, y, color, creatorID, lastModifiedID)
    { 
      //Get a connection
      databaseInstance.getConnection((connection)=>{
        //Create SQL  
        let sql = "insert into Tile (tile_id,board_id,x,y,color,creator_id, last_modified_id) values (?,?,?,?,?,?,?) on duplicate key update color = ?";
        //Execute Query
        connection.query(sql, [tileID, boardID, x, y, color, creatorID, lastModifiedID, color], function (err, result) {
          //Crash on error
          if (err) console.log('Error: ' + err);
          //Release the connection
          connection.release();
          //Pass back results
          resultCallback(result);
        });
      });
    }
		/****** PLAYER QUERIES ******/
  /**
   * Get user information.
   * @param username
   * @param hashedPassword
   * @constructor
   */


 /**	SetPlayerLocation
* Periodically store the coordinate location as well as
* the board number of the player/s.
* (Params) - playerID, x, y, boardID
* (Returns) - boolean
*/

/**  	GetPlayerLocation
* Retrieve last known player location and board.
* (Params) - playerID
* (Returns) - x, y, boardID
*/

/**		SetPlayerSprite
* Replaces any existing sprite for a player with 
* a new sprite.
* (Params) - playerID, spriteID
* (Returns) - boolean
*/

/**		GetPlayerSprite
* Finds the sprite of a given player.
* (Params) - playerID
* (Returns) - spriteName
*/

/**		UpdateDisplayName
* Updates a given player’s display name
* (Params) - playerID, newName
* (Returns) - boolean
*/

/**		UpdatePassword
* Updates a given player’s password
* (Params) - playerID, newHashedPassword
* (Returns) - boolean
*/
	
      /****** BOARD QUERIES ******/
      
/** 	CreateBoard
* Creates a new board table in the database.
* (Params) - boardID, boardName, playerID
* (Returns) - boolean
*/

  static createBoard(boardID, boardName, playerID) {
    //Get a connection
    databaseInstance.getConnection((connection)=>{
      //Create SQL
      let sql = "insert into Board(board_id, name, creator_id) values (?,?,?)";
      //Execute Query
      connection.query(sql, [boardID, boardName, playerID], function (err, result) {
        //Crash on error
        if (err) console.log('Error: ' + err);
        //Release the connection
        connection.release();
        //Pass back results
        resultCallback(result);
      });
    });
  }
/**  	ChangeBoardName
*  Change name of board.
*  (Params)  boardID, newName 
*  (Return)  NULL
*/
  static changeBoardName(boardID, newName) {
    //Get a connection
    databaseInstance.getConnection((connection)=>{
      //Create SQL
      let sql = "update Board set name = ? where board_id = ?";
      //Execute Query
      connection.query(sql, [newName, boardID], function (err, result) {
        //Crash on error
        if (err) console.log('Error: ' + err);
        //Release the connection
        connection.release();
        //Pass back results
        resultCallback(result);
      });
    });
  }

/**  	RemoveBoard
*  Remove entry for matching board ID.
*  (Params) - BoardID
*  (Returns) - NULL
*/
  static removeBoard(boardId) {
    //Get a connection
    databaseInstance.getConnection((connection)=>{
      //Create SQL
      let sql = "update Board set is_deleted = 1 where board_id = ?";
      //Execute Query
      connection.query(sql, [board_id], function (err, result) {
        //Crash on error
        if (err) console.log('Error: ' + err);
        //Release the connection
        connection.release();
        //Pass back results
        resultCallback(result);
      });
    });
  }
			/****** SPRITE QUERIES ******/
/**		GetAllSprites
* Pull all sprite information to local memory for later loading.
* (Params) - ????????
* (Returns) - Array[SpriteInfo]
*/

			/****** ADMIN QUERIES ******/
/**		MakeAdmin
* Adds a player to the admin table.
* (Params) - playerID
* (Returns) - boolean
*/

/**		RemoveAdmin
* Adds a player to the admin table.
* (Params) - playerID
* (Returns) - boolean
*/

			/****** HISTORY QUERIES ******/
/**		SetHistory
* Inserts into the History table
* (Params) - historyID, date_time, tile_id, player_id, color
* (Returns) - boolean
*/

}

exports.Query = Query;
