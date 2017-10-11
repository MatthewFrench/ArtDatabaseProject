module.exports.Player= function(connection, controller) {
    this.speed = 0.3;
    
    this.controller = controller;
    this.connection = connection;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.x = 0;
    this.y = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mousePressed = false;
    this.updateBuffer = null;
    this.verticalForce = 0;
    this.gravity = -0.05;
    this.width = 0.5-0.1; //Half a block in width
    this.height = 2-0.4; //Two blocks in height
    this.update = false;
    this.updateTimer = 0;
    this.updateTimerMax = 2;
    this.canJump = true;
    this.jumpForce = 1.5;
    this.direction = 0;
    this.selectedBlock = 1;
    
    this.logic = function(delta) {
        var deltaSpeed = this.speed*delta;
	this.verticalForce += this.gravity*delta;
	if (this.PushPlayerY(this.verticalForce)) { //Can't push
	    if (this.verticalForce < 0) {
		this.canJump = true;
	    }
	    this.verticalForce = 0;
	} else {this.update = true;this.canJump = false;}
        if (this.up) {
	    if (this.canJump) {
		this.verticalForce = this.jumpForce;
	    }
            //this.PushPlayerY(deltaSpeed);
        }
        if (this.down) {
            //this.PushPlayerY(-deltaSpeed);
        }
        if (this.left) {
	    this.SetDirection(0);
             if (this.PushPlayerX(-deltaSpeed) == false){this.update = true;}
        }
        if (this.right) {
	    this.SetDirection(1);
            if (this.PushPlayerX(deltaSpeed) == false) {this.update = true;}
        }
	this.updateTimer += 1;
        if (this.update == true && this.updateTimer >= this.updateTimerMax) {
	    this.update = false;
	    this.updateTimer = 0;
                //Send player update to all players
                this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genUpdateBuffer(this));
        }
        if (this.mousePressed) {
            
        } else {}
    }
    this.SetDirection = function (d) {
	if (this.direction != d) {
	    this.direction = d;
	    this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genDirectionBuffer(this));
	}
    }
    this.PushPlayerX = function(push) {
	var newX = this.x + push;
	
	var topLeft = {x: newX-this.width/2, y: this.y+this.height/2};
	var topRight = {x: newX+this.width/2, y: this.y+this.height/2};
	var bottomLeft = {x: newX-this.width/2, y: this.y-this.height/2};
	var bottomRight = {x: newX+this.width/2, y: this.y-this.height/2};
	
	for (var x = Math.floor(newX-this.width/2); x <= Math.ceil(newX+this.width/2); x++) {
	    for (var y = Math.floor(this.y-this.height/2); y <= Math.ceil(this.y+this.height/2); y++) {
		if (this.controller.blockMap.GetBlock(x, y) != 0) {
		    return true;
		}
	    }
	}
	
	this.x = newX;
	return false;
    }
    this.PushPlayerY = function(push) {
	var newY = this.y + push;
	
	var topLeft = {x: this.x-this.width/2, y: newY+this.height/2};
	var topRight = {x: this.x+this.width/2, y: newY+this.height/2};
	var bottomLeft = {x: this.x-this.width/2, y: newY-this.height/2};
	var bottomRight = {x: this.x+this.width/2, y: newY-this.height/2};
	
	for (var x = Math.floor(this.x-this.width/2); x <= Math.ceil(this.x+this.width/2); x++) {
	    for (var y = Math.floor(newY-this.height/2); y <= Math.ceil(newY+this.height/2); y++) {
		if (this.controller.blockMap.GetBlock(x, y) != 0) {
		    return true;
		}
	    }
	}
	
	this.y = newY;
	return false;
    }
}