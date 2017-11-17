let mysql = require("mysql");
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
  static Initialize(connectCallback) {
    databaseInstance = new Database(Configuration.GetHost(),
                                    Configuration.GetPort(),
                                    Configuration.GetDatabase(),
                                    Configuration.GetDBUsername(),
                                    Configuration.GETDBPassword(),
                                    connectCallback);
  }

  //Example queries to setup the others
  static CreateAccount(username, hashedPassword) {
    databaseInstance.getConnection((connection)=>{
      var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
      connection.query(sql, [parameters], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        connection.release();
      });
    });

    //let statement = mysql.createQuery("select * FROM Users where user=? and pass=?",
    //  [username, hashedPassword]);
    //Execute on database
    //Get user
    //Return user or null if none
  }
  static GetAccounts(username, hashedPassword) {
    let statement = mysql.createQuery("select * FROM Users where user=? and pass=?",
      [username, hashedPassword]);
    //Execute on database
    //Get user
    //Return user or null if none

    databaseInstance.query("SELECT * FROM customers", [parameters], function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  }

  static SetDisplayNameOfAccount() {

    databaseInstance.query('UPDATE user SET first_name = "'+ fName +
      '" WHERE username = "'+username+'"', [parameters], function(err, result){
      console.log('updated user! ' + element.username);
    });
  }

  /****** TILE QUERIES ******/
  /**	GetAllTiles
  * Retrieves all "tile information."
  * (Params) - boardID
  * (Returns) - all “tile information” for the board
  */
  
  
  /**	SetTile
  * After changing a tile in local memory, send the
  * update information to the board’s database.
 *  (Params) - “tile info”
  * (Returns) - boolean
  */

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
* (Params) - boardName, playerID
* (Returns) - boolean
*/

/**  	ChangeBoardName
*  Change name of board.
*  (Params)  boardID 
*  (Return)  NULL
*/

/**  	RemoveBoard
*  Remove entry for matching board ID.
*  (Params) - BoardID, playerID
*  (Returns) - NULL
*/

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
