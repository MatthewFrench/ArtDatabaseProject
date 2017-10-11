module.exports.Networking = function(controller) {
    this.controller = controller;
    //Send position update of player
    this.genUpdateBuffer = function(p) {
	if (p.updateBuffer == null) {
	    p.updateBuffer = new Buffer(11); //8int+16int+32float+32float
	}
	p.updateBuffer.writeUInt8(1, 0);
	p.updateBuffer.writeUInt16BE(p.connection.uID, 1);
	p.updateBuffer.writeFloatBE(p.x, 3);
	p.updateBuffer.writeFloatBE(p.y, 7);
	return p.updateBuffer;
    }
    //Send direction update of player
    this.genDirectionBuffer = function(p) {
	var buffer = new Buffer(4);
	buffer.writeUInt8(2, 0);
	buffer.writeUInt16BE(p.connection.uID, 1);
	buffer.writeUInt8(p.direction, 3);
	return buffer;
    }
    //Send the world
    this.SendWholeWorld = function(p, blockMap) {
	var blockArray = [];
	for (var key in blockMap.blocks) {
	    var k = blockMap.blocks[key];
	    for (var key2 in k) {
		var val = k[key2];
	    	if (val != 0) {
    		    blockArray.push({x: parseInt(key), y:parseInt(key2), val: val});
    		}
	    }
	}
	var backgroundBlockArray = [];
	for (var key in blockMap.backgroundBlocks) {
	    var k = blockMap.backgroundBlocks[key];
	    for (var key2 in k) {
		var val = k[key2];
	    	if (val != 0) {
    		    backgroundBlockArray.push({x: parseInt(key), y:parseInt(key2), val: val});
    		}
	    }
	}
	if (blockArray.length > 0 && p.connection.connected) {
	    p.connection.SendBinary(this.genBlockMapBuffer(blockArray));
	    p.connection.SendBinary(this.genBackgroundBlockMapBuffer(backgroundBlockArray));
	}
    }
    this.sendLimit = 200;
    this.sendTimeout = 5;
    this.sendLoopMax = 100000;
    this.SendBlockSection = function(p, blockMap, left, right, down, up, yOffset) {
	var blockArray = [];
	var cont = false;
	var newYOffset = 0;
	var loopAmount = 0;
	for (var x = left+1; x < right; x++) {
	    for (var y = down+1+yOffset; y < up; y++) {
		loopAmount += 1;
		var val = blockMap.GetBlock(x,y);
		if (val != 0) {
		    blockArray.push({x: x, y:y, val: val});
		}
		if (blockArray.length >= this.sendLimit || loopAmount >= this.sendLoopMax) {
		    left = x-1;
		    newYOffset = y-(down+1);
		    x = right;
		    y = up;
		    cont = true;
		}
	    }
	    yOffset = 0;
	}
	if (blockArray.length > 0 && p.connection.connected) {
	    p.connection.SendBinary(this.genBlockMapBuffer(blockArray));
	}
	if (cont && p.connection.connected) {
	    var self = this;
	    setTimeout(function(){self.SendBlockSection(p, blockMap, left, right, down, up, newYOffset);}, this.sendTimeout);
	}
    }
    //Send chunk of blocks
    this.genBlockMapBuffer = function(blockArray) {
	//I tried sending all blocks in an array but it makes it huge and can be wasteful
	//Send blocks
	var length = 5+(blockArray.length*(2+4+4)); //value, x and y
	var buffer = new Buffer(length);
	buffer.writeUInt8(4, 0); //1
	buffer.writeUInt32BE(blockArray.length, 1);
	var offset = 5;
	for (var i = 0; i < blockArray.length; i++) {
	    var b = blockArray[i];
	    buffer.writeInt32BE(b.x, offset);
	    buffer.writeInt32BE(b.y, offset+4);
	    buffer.writeUInt16BE(b.val, offset+8);
	    offset += 10;
	}
	return buffer;
    }
    //Send chunk of background blocks
    this.genBackgroundBlockMapBuffer = function(blockArray) {
	//I tried sending all blocks in an array but it makes it huge and can be wasteful
	//Send blocks
	var length = 5+(blockArray.length*(2+4+4)); //value, x and y
	var buffer = new Buffer(length);
	buffer.writeUInt8(5, 0); //1
	buffer.writeUInt32BE(blockArray.length, 1);
	var offset = 5;
	for (var i = 0; i < blockArray.length; i++) {
	    var b = blockArray[i];
	    buffer.writeInt32BE(b.x, offset);
	    buffer.writeInt32BE(b.y, offset+4);
	    buffer.writeUInt16BE(b.val, offset+8);
	    offset += 10;
	}
	return buffer;
    }
    //Send tile update
    this.genTileUpdate = function(x, y, blockMap) {
	var buffer = new Buffer(11);
	buffer.writeUInt8(3, 0);
	buffer.writeInt32BE(x, 1); //4
	buffer.writeInt32BE(y, 5); //4
	buffer.writeUInt16BE(blockMap.GetBlock(x, y), 9); //2
	return buffer;
    }
    //Send background tile update
    this.genBackgroundTileUpdate = function(x, y, blockMap) {
	var buffer = new Buffer(11);
	buffer.writeUInt8(6, 0);
	buffer.writeInt32BE(x, 1); //4
	buffer.writeInt32BE(y, 5); //4
	buffer.writeUInt16BE(blockMap.GetBlock(x, y), 9); //2
	return buffer;
    }
    this.SendBinaryToAllPlayers = function(b) {
	for (var i = 0; i < this.controller.players.length; i++) {
	   this.controller.players[i].connection.SendBinary(b);
	}
    }
    
    this.SendToAllPlayers = function(title, msg) {
	for (var i = 0; i < this.controller.players.length; i++) {
	   this.controller.players[i].connection.Send(title, msg);
	}
    }
    this.GetPlayerFromUID = function(uID) {
	for (var i = 0; i < this.controller.players.length; i++) {
            if (this.controller.players[i].connection.uID == uID) {return this.controller.players[i];}
        }
        return null;
    }
    
    this.GetPlayerFromConnection = function(connection) {
	for (var i = 0; i < this.controller.players.length; i++) {
            if (this.controller.players[i].connection == connection) {return this.controller.players[i];}
        }
        return null;
    }
}