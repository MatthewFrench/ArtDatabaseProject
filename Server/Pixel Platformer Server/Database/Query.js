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
                                    Configuration.GetDBUsername(),
                                    Configuration.GETDBPassword(), connectCallback);
  }

  /**
   * Get user information.
   * @param username
   * @param hashedPassword
   * @constructor
   */
  static GetUserInformationWithLoginInfo(username, hashedPassword) {
    let statement = mysql.createQuery("select * FROM Users where user=? and pass=?",
                        [username, hashedPassword]);
    //Execute on database
    //Get user
    //Return user or null if none
  }
}

exports.Query = Query;