module.exports.NormalGun = function(controller, player) {
    this.controller = controller;
    this.player = player;
    this.bulletTimer = 0;
    this.bulletInterval = 30;
    this.pulledTrigger = false;
    this.Logic = function () {
        this.bulletTimer += 1;
        if (this.pulledTrigger && this.bulletTimer >= this.bulletInterval) {
            this.bulletTimer = 0;
            this.ShootBullet();
        }
    }
    this.ShootBullet = function() {
        var b = CreateBullet(this.controller, this.player, 0);
        b.damage *= 1.5;
        b.bounceMax = 4;
        this.controller.bullets.push(b);
        this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genBulletAddBuffer(b));
    }
}
module.exports.BigGun = function(controller, player) {
    this.controller = controller;
    this.player = player;
    this.bulletTimer = 0;
    this.bulletInterval = 30;
    this.pulledTrigger = false;
    this.Logic = function () {
        this.bulletTimer += 1;
        if (this.pulledTrigger && this.bulletTimer >= this.bulletInterval) {
            this.bulletTimer = 0;
            this.ShootBullet();
        }
    }
    this.ShootBullet = function() {
        var b = CreateBullet(this.controller, this.player, 0);
        b.damage *= 0.5;
        b.bounceMax = 2;
        b.size = 14;
        this.controller.bullets.push(b);
        this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genBulletAddBuffer(b));
    }
}
module.exports.MachineGun = function(controller, player) {
    this.controller = controller;
    this.player = player;
    this.bulletTimer = 0;
    this.bulletInterval = 5;
    this.pulledTrigger = false;
    this.Logic = function () {
        this.bulletTimer += 1;
        if (this.pulledTrigger && this.bulletTimer >= this.bulletInterval) {
            this.bulletTimer = 0;
            this.ShootBullet();
        }
    }
    this.ShootBullet = function() {
        var b = CreateBullet(this.controller, this.player, 0);
        b.damage /= 6;
        b.bounceMax = 2;
        this.controller.bullets.push(b);
        this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genBulletAddBuffer(b));
    }
}
module.exports.BuckGun = function(controller, player) {
    this.controller = controller;
    this.player = player;
    this.bulletTimer = 0;
    this.bulletInterval = 30;
    this.pulledTrigger = false;
    this.Logic = function () {
        this.bulletTimer += 1;
        if (this.pulledTrigger && this.bulletTimer >= this.bulletInterval) {
            this.bulletTimer = 0;
            this.ShootBullet();
        }
    }
    this.ShootBullet = function() {
        var b = CreateBullet(this.controller, this.player, 0);
        this.controller.bullets.push(b);
        this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genBulletAddBuffer(b));
        b = CreateBullet(this.controller, this.player, 0.1);
        this.controller.bullets.push(b);
        this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genBulletAddBuffer(b));
        b = CreateBullet(this.controller, this.player, -0.1);
        this.controller.bullets.push(b);
        this.controller.networkingFunctions.SendBinaryToAllPlayers(this.controller.networkingFunctions.genBulletAddBuffer(b));
    }
}
var Bullet = require("./SGBullet.js").Bullet;
function CreateBullet(controller, player, rOffset) {
    var b = new Bullet(controller);
    b.size = 2;
    b.x = player.x + player.scale*0.7 * Math.cos(player.r+rOffset+0.25);
    b.y = player.y + player.scale*0.7 * Math.sin(player.r+rOffset+0.25);
    b.velX = b.bulletSpeed * Math.cos(player.r+rOffset);
    b.velY = b.bulletSpeed * Math.sin(player.r+rOffset);
    b.shooterID = player.connection.uID;
    return b;
}