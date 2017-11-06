global.uniqueBulletID = 0;
module.exports.Bullet = function(controller) {
    this.controller = controller;
    
    if (global.uniqueBulletID >= 65534) {
	global.uniqueBulletID = 0;
    }
    this.bulletID = global.uniqueBulletID;
    global.uniqueBulletID++;
    this.x = 0;
    this.y = 0;
    this.velX = 0;
    this.velY = 0;
    this.size = 0;
    this.bounces = 0;
    this.bounceMax = 1;
    this.bulletSpeed = 3;
    this.bulletLife = 10*60;
    this.shooterID = 0;
    this.speed = 5;
    this.damage = 10;
    
    this.logic = function(delta) {
        var deltaSpeed = this.speed*delta;
        this.PushBullet(this.velX*deltaSpeed, this.velY*deltaSpeed);
        this.bulletLife -= 1;
        for (var e = 0; e < this.controller.players.length; e++) {
            var p = this.controller.players[e];
            if (global.MiscFunctions.rectCollide(p.x-p.scale/2, p.y-p.scale/2, p.x+p.scale/2, p.y+p.scale/2, this.x-this.size, this.y-this.size, this.x+this.size, this.y+this.size)) {
                p.PlayerDamage(this);
                this.bulletLife = 0;
                e = this.controller.players.length;
            }
        }
        if (this.bounces > this.bounceMax || this.bulletLife <= 0) {
            return false;
        }
        return true;
    }
    this.PushBullet = function(xPush, yPush) {
	var newX = this.x + xPush;
	var newY = this.y + yPush;
	var bounce = false;
	for (var i = 0; i < this.controller.walls.length; i++) {
	    var w = this.controller.walls[i];
	    if (global.MiscFunctions.rectCollide(w.x, w.y, w.x+w.width, w.y+w.height, newX-this.size, this.y-this.size, newX+this.size, this.y+this.size)) {
		newX = this.x;
		bounce = true;
		this.velX *= -1;
	    }
	    if (global.MiscFunctions.rectCollide(w.x, w.y, w.x+w.width, w.y+w.height, this.x-this.size, newY-this.size, this.x+this.size, newY+this.size)) {
		newY = this.y;
		bounce = true;
		this.velY *= -1;
	    }
	}
	if (bounce) {
	    this.bounces += 1;
	}
	this.x = newX;
	this.y = newY;
        
        //console.log("Position: " + this.x + "," + this.y);
    }
}