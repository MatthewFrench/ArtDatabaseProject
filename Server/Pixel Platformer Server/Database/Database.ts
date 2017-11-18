let mysql = require("mysql2/promise");

//MySQL database initialization

//Execute Query Function

export class Database {
  connectionPool: any;

  constructor(host, port, database, username, password) {
    this.connectionPool = mysql.createPool({
      host: host,
      port: port,
      database: database,
      user: username,
      password: password
    });
  }

  async getConnection() {
    return await this.connectionPool.getConnection();
  }
}