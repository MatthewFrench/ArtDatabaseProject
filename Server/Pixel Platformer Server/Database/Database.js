let mysql = require("mysql");

//MySQL database initialization

//Execute Query Function

class Database {
  constructor(host, username, password, connectCallback) {
    this.connection = mysql.createConnection({
      host: host,
      user: username,
      password: password
    });
    console.log(`Connecting to database: ${host}`);
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