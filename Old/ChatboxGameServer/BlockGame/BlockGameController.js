module.exports.BlockGame = function(networking) {
    this.networking = networking;
    this.players = [];
    var nF = require("./BlockGameNetworking.js").Networking;
    this.networkingFunctions = new nF(this);
    var Player = require("./BlockGamePlayer.js").Player;
    var BlockMap = require("./BlockGameMap.js").BlockMap;
    this.blockMap = new BlockMap();
    this.blockSize = 10;
    
    //Add Walls
    LoadRandomLevel(this);
    
    this.GameLogic = function(delta) {
        var deltaSpeed = this.speed*delta;
        for (var i = 0; i < this.players.length; i++) {
		this.players[i].logic(delta);
	}
    }
    var controller = this;
    this.AddPlayer = function(connection) {
        console.log("Added " + connection.name + " to Block mini game.");
        connection.Send("MiniGame",{game: "Block"});
	var p = new Player(connection, controller);
	p.x = 0;
	p.y = 10;
        this.players.push(p);
	//Now tell all players about the player that just entered
	this.networkingFunctions.SendToAllPlayers('AddPlayer', {uID:p.connection.uID, x:p.x,y:p.y, name:connection.name});
	//Now tell the player about all other players
	for (var i = 0; i < this.players.length;i++) {
	    var p2 = this.players[i];
	    if (p != p2) {
		p.connection.Send('AddPlayer', {uID:p2.connection.uID, x:p2.x,y:p2.y, name:p2.connection.name});
	    }
	}
	//Send all blocks to player
	this.networkingFunctions.SendWholeWorld(p, this.blockMap);
	//this.networkingFunctions.SendBlockSection(p, this.blockMap, this.blockMap.left, this.blockMap.right, this.blockMap.down, this.blockMap.up, 0);
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
		case 4: //Tile Position
		    if (Math.abs(p.verticalForce) < 10) {
			this.SetTile(p, buffer.readInt32BE(1), buffer.readInt32BE(5));
		    }
		    break;
		case 5: //Selected Block
		    p.selectedBlock = buffer.readUInt8(1);
		    break;
		case 6: //Draw background tile
		    if (Math.abs(p.verticalForce) < 10) {
			this.SetTile(p, buffer.readInt32BE(1), buffer.readInt32BE(5));
		    }
		    break;
		default:
	    }
	}
    }
    this.SetTile = function(p, x, y) {
	this.blockMap.PlaceBlock(x, y, p.selectedBlock);
	this.networkingFunctions.SendBinaryToAllPlayers(this.networkingFunctions.genTileUpdate(x, y, this.blockMap));
    }
}

function LoadRandomLevel(controller) {
    var fs  = require("fs");
    var object = JSON.parse(fs.readFileSync("BlockGame/Level.txt").toString());
    for (var key in object) {
	var k = object[key];
	for (var key2 in k) {
	    var val = k[key2];
	    var x = parseInt(key);
	    var y = parseInt(key2);
	    if (val != 0) {// && !(val == 1 && (x == 0 || x == 1 || y == 0 || y == 1))) {
		controller.blockMap.PlaceBlock(x, y, val);
	    }
	}
    }
}