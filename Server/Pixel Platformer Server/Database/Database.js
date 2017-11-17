let mysql = require("mysql");

//MySQL database initialization

//Execute Query Function

class Database {
  constructor(host, port, database, username, password) {
    this.connectionPool = mysql.createPool({
      host: host,
      port: port,
      database: database,
      user: username,
      password: password
    });
  }

  getConnection(connectionCallback) {
    this.connectionPool.getConnection(function(err, connection) {
      if (err) {
        console.log('Get connection error: ' + err);
      }
      connectionCallback(connection);
    });
  }
}

exports.Database = Database;