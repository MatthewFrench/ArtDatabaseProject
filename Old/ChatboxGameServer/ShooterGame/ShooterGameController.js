module.exports.ShooterGame = function(networking) {
    this.networking = networking;
    this.players = new Array();
    var nF = require("./SGNetworking.js").Networking;
    this.networkingFunctions = new nF(this);
    var Player = require("./SGPlayer.js").Player;
    var Bullet = require("./SGBullet.js").Bullet;
    this.bullets = new Array();
    this.bulletSpeed = 3;
    this.bulletUpdateTimer = 0;
    this.bulletUpdateInterval = 1;
    
    this.blockSize = 70;
    this.levels = new Array("The Arena.txt", "GamemakersGarage.txt");
    this.lava = new Array();
    this.walls = new Array();
    this.spawns = new Array();
    this.levelCounter = 0;
    this.levelCounterMax = 60*150; //Load new level every 2.5 minutes
    
    //Add Walls
    LoadRandomLevel(this);
    
    this.GameLogic = function(delta) {
        var deltaSpeed = this.speed*delta;
        for (var i = 0; i < this.players.length; i++) {
		this.players[i].logic(delta);
	}
	for (var i = 0; i < this.bullets.length;i++) {
            if (!this.bullets[i].logic(delta)) {
                this.networkingFunctions.SendBinaryToAllPlayers(this.networkingFunctions.genBulletRemoveBuffer(this.bullets[i]));
                this.bullets.splice(i, 1);
                i--;
            }
	}
	this.bulletUpdateTimer += 1;
	if (this.bulletUpdateTimer >= this.bulletUpdateInterval) {
	    this.bulletUpdateTimer = 0;
            //Need replaced with networking
	    this.networkingFunctions.SendBinaryToAllPlayers(this.networkingFunctions.genBulletUpdateBuffer(this.bullets));
	}
        //Level counter
        this.levelCounter += 1;
        if (this.levelCounter > this.levelCounterMax) {
            this.levelCounter = 0;
            LoadRandomLevel(this);
        }
    }
    var controller = this;
    this.AddPlayer = function(connection) {
        console.log("Added " + connection.name + " to Shooter mini game.");
        connection.Send("MiniGame",{game: "Shooter"}); //Tell player to enter Tag
	var p = new Player(connection, controller);
        var n = this.GetRandomSpawn();
	p.x = n.x;
	p.y = n.y;
        this.players.push(p);
	//Now tell all players about the player that just entered
	this.networkingFunctions.SendToAllPlayers('AddPlayer', {uID:p.connection.uID, x:p.x,y:p.y, name:connection.name, health:p.health});
	//Now tell the player about all other players
	for (var i = 0; i < this.players.length;i++) {
	    var p2 = this.players[i];
	    if (p != p2) {
		p.connection.Send('AddPlayer', {uID:p2.connection.uID, x:p2.x,y:p2.y, name:p2.connection.name, health:p2.health});
	    }
	}
	//Send all bullets to player
	for (var i = 0; i < this.bullets.length; i++) {
	    var b = this.bullets[i];
	    p.connection.SendBinary(this.networkingFunctions.genBulletAddBuffer(b));
	}
	//Send walls to player
	for (var i = 0; i < this.walls.length;i++) {
	    var w = this.walls[i];
	    p.connection.Send('AddWall', {x: w.x, y: w.y, width: w.width, height: w.height});
	}
        //Send lava to player
	for (var i = 0; i < this.lava.length;i++) {
	    var w = this.lava[i];
	    p.connection.Send('AddLava', {x: w.x, y: w.y, width: w.width, height: w.height});
	}
    }
    this.RemovePlayer = function(connection) {
	var p = this.networkingFunctions.GetPlayerFromUID(connection.uID);
	this.players.splice(this.players.indexOf(p), 1);
        this.networkingFunctions.SendToAllPlayers('RemovePlayer', {uID:connection.uID});
    }
    this.Message = function(connection, title, message) {
        
    }
    this.BinaryMessage = function(connection, buffer) {
        var p = this.networkingFunctions.GetPlayerFromConnection(connection);
	if (p != null) {
	    switch(buffer.readInt8(0)) {
		case 0: //Right
		    p.right = (buffer.readInt8(1) == 0)?false:true;
		    break;
		case 1: //Left
		    p.left = (buffer.readInt8(1) == 0)?false:true;
		    break;
		case 2: //Up
		    p.up = (buffer.readInt8(1) == 0)?false:true;
		    break;
		case 3: //Down
		    p.down = (buffer.readInt8(1) == 0)?false:true;
		    break;
		case 4: //Mouse Position
		    p.mouseX = buffer.readInt16BE(1);
		    p.mouseY = buffer.readInt16BE(3);
		    p.UpdateRotation();
		    break;
		case 5: //Mouse Down
		    console.log("GOt mouse down");
		    p.mousePressed = (buffer.readInt8(1) == 0)?false:true;
		    break;
		default:
	    }
	}
    }
    this.GetRandomSpawn = function() {
        var spawnNum = Math.floor(Math.random()*this.spawns.length);
        return this.spawns[spawnNum];
    }
}

function LoadRandomLevel(controller) {
    var fs  = require("fs");
    var blockSize = controller.blockSize;
    var levelNum = Math.floor(Math.random()*controller.levels.length);
    var array = fs.readFileSync("ShooterGame/Levels/"+controller.levels[levelNum]).toString().split('\n');
    //Erase all previous walls
    controller.lava.splice(0, controller.lava.length);
    controller.walls.splice(0, controller.walls.length);
    controller.networkingFunctions.SendBinaryToAllPlayers(controller.networkingFunctions.genClearWallsBuffer());
    controller.spawns.splice(0, controller.spawns.length);
    //Now load the level
    for (var i = 0; i < array.length; i++) {
        var parts = array[i].split(',');
        if (parts[2] == 49) { //Wall
            controller.walls.push(new Rect(parts[0]*blockSize, parts[1]*blockSize, blockSize, blockSize));
        }
        if (parts[2] == 50) { //Lava
            controller.lava.push(new Rect(parts[0]*blockSize, parts[1]*blockSize, blockSize, blockSize));
        }
        if (parts[2] == 71) { //Spawn
            controller.spawns.push({x: parts[0]*blockSize+blockSize/2.0,y: parts[1]*blockSize+blockSize/2.0});
        }
    }
    //Send new positions to player
    for (var i = 0; i < controller.players.length;i++) {
        var p = controller.players[i];
        var n = controller.GetRandomSpawn();
        p.x = n.x;
	p.y = n.y;
	controller.networkingFunctions.SendBinaryToAllPlayers(controller.networkingFunctions.genUpdateBuffer(p));
    }
    //Send walls to player
    for (var i = 0; i < controller.walls.length;i++) {
        var w = controller.walls[i];
        for (var e = 0; e < controller.players.length;e++) {
            var p = controller.players[e];
            p.connection.Send('AddWall', {x: w.x, y: w.y, width: w.width, height: w.height});
        }
    }
    //Send lava to player
    for (var i = 0; i < controller.lava.length;i++) {
        var w = controller.lava[i];
        for (var e = 0; e < controller.players.length;e++) {
            var p = controller.players[e];
            p.connection.Send('AddLava', {x: w.x, y: w.y, width: w.width, height: w.height});
        }
    }
}


// Classes local to mini game
function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}