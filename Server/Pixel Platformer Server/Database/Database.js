let mysql = require("mysql");

//MySQL database initialization

//Execute Query Function

class Database {
  constructor(host, port, database, username, password, connectCallback) {
    this.connection = mysql.createConnection({
      host: host,
      port: port,
      database: database,
      user: username,
      password: password
    });
    console.log(`Connecting to database: ${database} at ${host} on port ${port}`);
    console.log(`Database username: ${username}`);
    console.log(`Database password: ${password}`);
    this.connection.connect(function(err) {
      if (err) throw err;
      console.log(`Connected to ${host}!`);
      connectCallback();
    });
  }
}

exports.Database = Database;