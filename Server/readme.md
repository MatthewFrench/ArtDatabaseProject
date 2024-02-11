The purpose of the server.

(1) Talk to clients.

(2) Talk to the database.

(3) Process all game logic.


How to run:

"npm run Build" - Compiles Typescript

"npm run Build-Continously" - Compiles Typescript continuously

"node main.js" - In Build folder runs the server

"node Unit Tests/run.js" - In Build folder runs the unit tests

Run `docker-compose -f "local-only-mysql-docker-compose.yml" up` to create the local mysql database. Then create the configuration.json file to connect.