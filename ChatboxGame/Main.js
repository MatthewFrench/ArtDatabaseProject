/**Variables**/
var name;
var currentMiniGame = null;
var clearScreen = true;
var gameCanvas; 
var gameCtx;
var networking;
var uID = -1;
var GameWidth =  856;
var GameHeight = 500;

var dingSound;
var initialDing = false;

function setup(n) {
    dingSound = new Audio("http://gamemakersgarage.com/forum/chat/ding.wav");
    name = n;
    chat = document.getElementById('chat');
    chatbox = document.getElementById("chatbox");
    onlineStatus = document.getElementById("onlineStatus");
    chat.onkeyup = chatKeyUp;
    gameCanvas = document.getElementById("chatbox-game");  
    gameCtx = gameCanvas.getContext("2d");
    gameCanvas.width=855;
    gameCanvas.height=500;
    gameCanvas.addEventListener('keydown', keyDown, false);
    gameCanvas.addEventListener('keyup', keyUp, false);
    gameCanvas.addEventListener('mousedown', mouseDown, false);
    gameCanvas.addEventListener('mouseup', mouseUp, false);
    window.addEventListener('mousemove', mouseMove, false);
    gameCanvas.focus();
    drawLoop();
    networking = new Networking();
    addChat('Connecting to server...');
}

function keyDown(e) {
    if (currentMiniGame != null) {
	currentMiniGame.keyDown(e);
    }
    e.preventDefault();
    gameCanvas.focus();
}
function keyUp(e) {
    if (e.keyCode == 84) {
	chat.focus();
    } else {
	if (currentMiniGame != null) {
	    currentMiniGame.keyUp(e);
	}
	gameCanvas.focus();
    }
    e.preventDefault();
}
function mouseDown(e) {
    if (currentMiniGame != null) {
	var rect = gameCanvas.getBoundingClientRect();
	currentMiniGame.mouseDown(e, e.clientX - rect.left,e.clientY - rect.top);
    }
    e.preventDefault();
    gameCanvas.focus();
}
function mouseUp(e) {
    if (currentMiniGame != null) {
	currentMiniGame.mouseUp(e);
    }
    e.preventDefault();
}
function mouseMove(e) {
    if (currentMiniGame != null) {
	var rect = gameCanvas.getBoundingClientRect();
	currentMiniGame.mouseMove(e.clientX - rect.left,e.clientY - rect.top);
    }
    e.preventDefault();
}

function Message(title, message) {
    switch(title)
    {
	case "MiniGame":
	    if (currentMiniGame != null) {
		//Maybe do somethin
	    }
	    if (message.game == "Block") {
	       currentMiniGame = new BlockGame();
	    }
	    if (message.game == "Selector") {
		currentMiniGame = new Selector();
	    }
	    if (message.game == "Shooter") {
		currentMiniGame = new ShooterGame();
	    }
	    if (message.game == "SpaceCraft") {
		currentMiniGame = new SpaceCraft();
	    }
	    break;
	case "Chat":
	    addChat(message.chat);
	    break;
	case "OnlineList":
	    setOnline(message.online);
	    initialDing = true;
	    break;
	case "ID":
	    uID = message.uID;
	    break;
	default:
	    if (currentMiniGame != null) {
		currentMiniGame.Message(title, message);
	    }
    }
}

function BinaryMessage(buffer) {
    if (currentMiniGame != null) {
	currentMiniGame.BinaryMessage(buffer);
    }
}


var prevTime;
var curTime = Date.now();
var deltaTime;
function draw() {
    prevTime = curTime;
    curTime = Date.now();
    deltaTime = curTime - prevTime;
    var delta = deltaTime / (1000.0/60);
	
    if (currentMiniGame != null) {
	currentMiniGame.draw(delta);
    } else {
	gameCtx.clearRect ( 0 , 0 , gameCtx.canvas.width , gameCtx.canvas.height );
	gameCtx.fillStyle = "Black";
	gameCtx.fillRect(0,  0, gameCtx.canvas.width, gameCtx.canvas.height);
	gameCtx.fillStyle = "White";
	gameCtx.font = "16px Arial";
	gameCtx.textAlign = 'left';
	gameCtx.fillText("No mini-game loaded.", 25, 25);
    }
}

function drawLoop() {
    window.requestAnimationFrame(drawLoop);
    //window.setTimeout(drawLoop, 1000 / 60);
    draw();    
}



//Chatbox Code
var chat;
var chatbox;
var onlineStatus;
function chatKeyUp(event){
    if(event.keyCode == 13){
	var sendTxt = chat.value;
	if (sendTxt != "") {
	    //Send the text
	    networking.Send("Chat", {chat:sendTxt});
	    chat.value = "";
	    gameCanvas.focus();
	}
    }
};
function addChat(text) {
    chatbox.value += text + '\n';
    chatbox.scrollTop = chatbox.scrollHeight;
    if (initialDing) {
	dingSound.play()
    }
}
function setOnline(text) {
    onlineStatus.innerHTML=text;
}