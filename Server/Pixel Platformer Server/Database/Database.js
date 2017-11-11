let mysql = require("mysql");

//MySQL database initialization

//Execute Query Function

class Database {
  constructor(host, port, username, password, connectCallback) {
    this.connection = mysql.createConnection({
      host: host,
      port: port,
      user: username,
      password: password
    });
    console.log(`Connecting to database: ${host} on port ${port}`);
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