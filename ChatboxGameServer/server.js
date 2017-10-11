require("./Networking.js");
require("./MiscFunctions.js");
var BlockGame = require("./BlockGame/BlockGameController.js").BlockGame;
var SpaceCraft = require("./SpaceCraft/SpaceCraftController.js").SpaceCraft;
var ShooterGame = require("./ShooterGame/ShooterGameController.js").ShooterGame;
var Selector = require("./GameSelector/SelectorController.js").Selector;

global.GameWidth =  856;
global.GameHeight = 500;
var chatLog = new Array();
//Places the player can go
var blockMiniGame;
var selector;
var spaceCraftGame;
var shooterGame;

//Called by networking
global.StartMiniGame = function(connection, name) {
    var miniGame = null;
    if (name == "Selector") {
	miniGame = selector;
    }
    if (name == "Block") {
	miniGame = blockMiniGame;
    }
    if (name == "SpaceCraft") {
	miniGame = spaceCraftGame;
    }
    if (name == "Shooter") {
	miniGame = shooterGame;
    }
    
    if (miniGame != null) {
	//Remove play from previous mini game
	if (connection.miniGame != null) {
	    connection.miniGame.RemovePlayer(connection);
	}
	connection.miniGame = miniGame;
	miniGame.AddPlayer(connection);
    }
}
global.PlayerConnected = function(connection) {
    //Don't add player until we have their name. They limbo
    //Send player last 30 chats
    var s = chatLog.length - 30;
    if (s < 0) {
	s = 0
    }
    for (s; s < chatLog.length; s++) {
	connection.Send("Chat", {chat: chatLog[s]});
    }
    //Send player's identification
    connection.Send("ID", {uID: connection.uID});
}
global.PlayerDisconnected = function(connection) {
    connection.miniGame.RemovePlayer(connection);
    console.log(connection.name + ' has disconnected');
    SendOnlineStatusUpdate();
}
global.PlayerMessage = function(connection, title, msg) {
    if (title == "Name") {
	console.log(msg.name + " has connected");
	connection.name = msg.name;
	StartMiniGame(connection, "Selector");
	SendOnlineStatusUpdate();
    } else if (title == "Chat"){
	chatLog.push(connection.name + ": " +msg.chat);
	networking.SendToAll("Chat", {chat: connection.name + ": " +msg.chat});
	console.log(connection.name + ": " +msg.chat);
    } else {
	connection.miniGame.Message(connection, title, msg);
    }
}
global.PlayerBinaryMessage = function(connection, buffer) {
    connection.miniGame.BinaryMessage(connection, buffer);
}

var prevTime;
var curTime = Date.now();
var deltaTime;

//var frameCount = 0;
//var frameTime = Date.now();
//var newTime;
//var fpsLogInterval = 200*1000;
// Logic 60 frames per second
var interval = setInterval(function() {
	prevTime = curTime;
	curTime = Date.now();
	deltaTime = curTime - prevTime;
	var delta = deltaTime / (1000.0/60);
	
	//currentMiniGame.GameLogic(delta);
	blockMiniGame.GameLogic(delta);
	spaceCraftGame.GameLogic(delta);
	shooterGame.GameLogic(delta);
	selector.GameLogic(delta);
	
	//frameCount += 1;
	//newTime = Date.now();
	//if (newTime - frameTime >= fpsLogInterval) {
	//    console.log("FPS: " + (frameCount*1000/(newTime - frameTime)));
	//    frameCount = 0;
	//    frameTime = newTime;
	//}
},1000/60);

var SendOnlineStatusUpdate = function() {
    //Send everyone who's online
    var o = "";
    for (var i = 0; i < networking.connections.length; i++) {
	o += networking.connections[i].name;
	if (i != networking.connections.length-1) {
	    o += ", ";
	}
    }
    console.log("Online: " + o);
    networking.SendToAll("OnlineList", {online: o});
}
//Run
var networking = new Networking(7778); //Creates and starts server
blockMiniGame = new BlockGame(networking);
spaceCraftGame = new SpaceCraft(networking);
shooterGame = new ShooterGame(networking);
selector = new Selector();