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

## To run server and mysql in docker
Run `docker-compose -f "server-and-mysql-docker-compose.yml" up`.  
The mysql database will only be accessible by the server docker instance. The server docker instance will be accessible on 7777.
To rebuild only the server, add `--build art-server` to the above command.

This will need a self-signed cert when running locally. Use:
```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
```