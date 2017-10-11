module.exports.Player= function(connection, controller) {
    this.speed = 5;
    this.scale = 35;
    
    this.controller = controller;
    this.connection = connection;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.x = 50;
    this.y = 50;
    this.r = 180;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mousePressed = false;
    this.updateBuffer = null;
    this.health = 100;
    this.gun = RandomGun(controller, this);    
    
    this.logic = function(delta) {
        var deltaSpeed = this.speed*delta;
        if (this.up) {
            this.PushPlayerY(-deltaSpeed);
        }
        if (this.down) {
            this.PushPlayerY(deltaSpeed);
        }
        if (this.left) {
            this.PushPlayerX(-deltaSpeed);
        }
        if (this.right) {
            this.PushPlayerX(deltaSpeed);
        }
        if (this.up || this.down || this.left || this.right) {
                //Send player update to all players
                this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genUpdateBuffer(this));
        }
        if (this.mousePressed) {
            this.gun.pulledTrigger = true;
        } else {this.gun.pulledTrigger = false;}
        this.gun.Logic();
        var lavaDamage = false;
        for (var i = 0; i < this.controller.lava.length; i++) {
	    var w = this.controller.lava[i];
	    if (global.MiscFunctions.rectCollide(w.x, w.y, w.x+w.width, w.y+w.height, this.x-this.scale/2, this.y-this.scale/2, this.x+this.scale/2, this.y+this.scale/2)) {
		lavaDamage = true;
	    }
	}
        if (lavaDamage) {
            this.damage(1.0);
        }
    }
    this.UpdateRotation = function() {
	var newRot = Math.atan2(this.mouseY - GameHeight/2,this.mouseX - GameWidth/2);
	if (this.r != newRot) {
	    this.r = newRot;
	    this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genUpdateBuffer(this));
	}
    } 
    this.PushPlayerX = function(push) {
	var newX = this.x + push;
	for (var i = 0; i < this.controller.walls.length; i++) {
	    var w = this.controller.walls[i];
	    if (global.MiscFunctions.rectCollide(w.x, w.y, w.x+w.width, w.y+w.height, newX-this.scale/2, this.y-this.scale/2, newX+this.scale/2, this.y+this.scale/2)) {
		newX = this.x;
	    }
	}
	this.x = newX;
    }
    this.PushPlayerY = function(push) {
	var newY = this.y + push;
	for (var i = 0; i < this.controller.walls.length; i++) {
	    var w = this.controller.walls[i];
	    if (global.MiscFunctions.rectCollide(w.x, w.y, w.x+w.width, w.y+w.height, this.x-this.scale/2, newY-this.scale/2, this.x+this.scale/2, newY+this.scale/2)) {
		newY = this.y;
	    }
	}
	this.y = newY;
    }
    this.PlayerDamage = function(b) {
	this.health -= b.damage;
	if (this.health <= 0) {
	    this.health = 100;
            this.gun = RandomGun(controller, this);
            var n = controller.GetRandomSpawn();
            this.x = n.x;
            this.y = n.y;
	    this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genUpdateBuffer(this));
	}
	//Send health update
	this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genPlayerHealthBuffer(this));
    }
    this.damage = function(amount) {
	this.health -= amount;
	if (this.health <= 0) {
	    this.health = 100;
            this.gun = RandomGun(controller, this);
            var n = controller.GetRandomSpawn();
            this.x = n.x;
            this.y = n.y;
	    this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genUpdateBuffer(this));
	}
	//Send health update
	this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genPlayerHealthBuffer(this));
    }
}
var NormalGun = require("./SGGun.js").NormalGun;
var MachineGun = require("./SGGun.js").MachineGun;
var BuckGun = require("./SGGun.js").BuckGun;
var BigGun = require("./SGGun.js").BigGun;
function RandomGun(controller, player) {
    var n = Math.floor((Math.random()*4)+1);
    if (n == 1) {
        return new NormalGun(controller, player);
    } else if (n == 2) {
        return new MachineGun(controller, player);
    } else if (n == 3) {
        return new BuckGun(controller, player);
    } else if (n == 4) {
        return new BigGun(controller, player);
    }
    return new NormalGun(controller, player);
}