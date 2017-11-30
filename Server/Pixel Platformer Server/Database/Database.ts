let mysql = require("mysql2/promise");

//MySQL database initialization

//Execute Query Function

export class Database {
    host: any;
    port: any;
    database: any;
    username: any;
    password: any;
    connectionPool: any;

    constructor(host, port, database, username, password) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.username = username;
        this.password = password;
        this.resetConnectionPool();
    }

    resetConnectionPool() {
        this.connectionPool = mysql.createPool({
            host: this.host,
            port: this.port,
            database: this.database,
            user: this.username,
            password: this.password,
            supportBigNumbers: true,
            multipleStatements: true,
            connectionLimit: 50
        });
    }

    async getConnection() {
        return await this.connectionPool.getConnection();
    }
}