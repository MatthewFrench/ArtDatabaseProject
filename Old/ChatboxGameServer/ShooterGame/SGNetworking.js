module.exports.Networking = function(controller) {
    this.controller = controller;
    this.genClearWallsBuffer = function() {
	var buffer = new Buffer(1); 
	buffer.writeUInt8(7, 0);
	return buffer;
    }
    this.genUpdateBuffer = function(p) {
	if (p.updateBuffer == null) {
	    p.updateBuffer = new Buffer(15); //8int+16int+32float+32float+float
	}
	p.updateBuffer.writeUInt8(1, 0);
	p.updateBuffer.writeUInt16BE(p.connection.uID, 1);
	p.updateBuffer.writeFloatBE(p.x, 3);
	p.updateBuffer.writeFloatBE(p.y, 7);
	p.updateBuffer.writeFloatBE(p.r, 11);
	return p.updateBuffer;
    }
    this.genBulletAddBuffer = function(b) {
        var buffer = new Buffer(15); 
	buffer.writeUInt8(3, 0);
	buffer.writeUInt16BE(b.bulletID, 1);
	buffer.writeFloatBE(b.x, 3);
	buffer.writeFloatBE(b.y, 7);
	buffer.writeFloatBE(b.size, 11);
	return buffer;
    }
    this.genBulletUpdateBuffer = function(b) {
	var buffer = new Buffer(10*b.length + 1);
	buffer.writeUInt8(4, 0);
	for (var i = 0; i < b.length; i++) {
	    var bullet = b[i];
	    buffer.writeUInt16BE(bullet.bulletID, 0+10*i+1);
	    buffer.writeFloatBE(bullet.x, 2+10*i+1);
	    buffer.writeFloatBE(bullet.y, 6+10*i+1);
	}
	return buffer;
    }
    this.genBulletRemoveBuffer = function(b) {
        var buffer = new Buffer(3); 
	buffer.writeUInt8(5, 0);
	buffer.writeUInt16BE(b.bulletID, 1);
	return buffer;
    }
    this.genPlayerHealthBuffer = function(p) {
        var buffer = new Buffer(7); 
	buffer.writeUInt8(6, 0);
	buffer.writeUInt16BE(p.connection.uID, 1);
	buffer.writeFloatBE(p.health, 3);
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