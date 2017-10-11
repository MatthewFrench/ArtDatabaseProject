function ShooterGame() {
    this.blockSize = 50;
    this.redrawScreen = true;
    this.gridImage = drawGridImage(this.blockSize);
    this.playerImg = new Image();this.playerImg.onload = function() {
        this.redrawScreen = true;
      };this.playerImg.src = "Images/Shootingman.png";
    this.players = new Array();
    this.up = false, this.down = false, this.right = false, this.left = false;
    this.mousePosition = {};
    this.mousePressed = false;
    this.bullets = new Array();
    this.bulletSpeed = 8;
    this.walls = new Array();
    this.lava = new Array();
    
    this.Message = function(title, message) {
        if (title == "AddPlayer") {
            var p = new this.Player();
            p.uID = message.uID;
            p.x = message.x;
            p.y = message.y;
            p.name = message.name;
            p.health = message.health;
            this.players.push(p);
            this.redrawScreen = true;
        }
        if (title == "RemovePlayer") {
            this.RemovePlayer(this.GetPlayerFromUID(message.uID));
            this.redrawScreen = true;
        }
        if (title == "AddWall") {
            var w = new this.Wall();
            w.x = message.x;
            w.y = message.y;
            w.width = message.width;
            w.height = message.height;
            this.walls.push(w);
        }
        if (title == "AddLava") {
            var w = new this.Lava();
            w.x = message.x;
            w.y = message.y;
            w.width = message.width;
            w.height = message.height;
            this.lava.push(w);
        }
    }
    
    this.BinaryMessage = function(buffer) {
        switch(buffer.getInt8(0))
        {
            case 1: //Update
                var p = this.GetPlayerFromUID(buffer.getInt16(1));
                p.x = buffer.getFloat32(3);
                p.y = buffer.getFloat32(7);
                p.r = buffer.getFloat32(11);
                this.redrawScreen = true;
                break;
            case 3: //Add bullet
                var b = new this.Bullet();
                b.bulletID = buffer.getInt16(1);
                b.x = buffer.getFloat32(3);
                b.y = buffer.getFloat32(7);
                b.size = buffer.getFloat32(11);
                this.bullets.push(b);
                this.redrawScreen = true;
                break;
            case 4: //Update bullet
                for (var i = 0; i < (buffer.byteLength-1)/10; i++) {
                    var b = this.GetBulletFromID(buffer.getInt16(0+10*i+1));
                    b.x = buffer.getFloat32(2+10*i+1);
                    b.y = buffer.getFloat32(6+10*i+1);
                }
                this.redrawScreen = true;
                break;
            case 5: //Remove bullet
                var i = buffer.getInt16(1);
                this.bullets.splice(this.bullets.indexOf(this.GetBulletFromID(i)), 1);
                this.redrawScreen = true;
                break;
            case 6: //Player Health
                var p = this.GetPlayerFromUID(buffer.getInt16(1));
                p.health = buffer.getFloat32(3);
                this.redrawScreen = true;
                break;
            case 7: //Clear walls
                this.walls = new Array();
                this.lava = new Array();
                this.redrawScreen = true;
                break;
            default:
        }
    }
    
    this.draw = function(delta) {
        var p = this.GetPlayerFromUID(uID);
        if (this.redrawScreen && p != null) {
            var offsetX = Math.round(p.x - GameWidth/2);
            var offsetY = Math.round(p.y - GameHeight/2);
            
            gameCtx.clearRect ( 0 , 0 , gameCtx.canvas.width , gameCtx.canvas.height );
            
            
            gameCtx.save();
            gameCtx.translate(-offsetX, -offsetY);
            gameCtx.fillStyle = gameCtx.createPattern(this.gridImage, 'repeat');
            gameCtx.fillRect(0+offsetX,0+offsetY,gameCtx.canvas.width,gameCtx.canvas.height);
            gameCtx.restore();
            
            for (var i = 0; i < this.walls.length; i++) {
                this.drawWall(this.walls[i], offsetX, offsetY);
            }
            
            for (var i = 0; i < this.lava.length; i++) {
                this.lava[i].logic();
                this.drawLava(this.lava[i], offsetX, offsetY);
            }
            
            for (var i = 0; i < this.players.length; i++) {
                var p2 = this.players[i];
                if (p2 != p) {
                    this.drawPlayer(p2,p2.x - offsetX, p2.y - offsetY, p2.r);
                }
            }
            for (var i = 0; i < this.bullets.length; i++) {
                var b = this.bullets[i];
                this.drawBullet(b,b.x - offsetX, b.y - offsetY);
            }
            
            this.drawPlayer(p, Math.round(GameWidth/2), Math.round(GameHeight/2, p.r));
            this.redrawScreen = false;
        }
    }
    this.drawWall = function(w, offsetX, offsetY) {
        gameCtx.fillStyle = "rgba(0,0,0,0.9)";
        gameCtx.fillRect(w.x - offsetX, w.y - offsetY, w.width, w.height);
        gameCtx.strokeStyle = "Black";
        gameCtx.strokeRect(w.x - offsetX, w.y - offsetY, w.width, w.height);
    }
    this.drawLava = function(w, offsetX, offsetY) {
        gameCtx.fillStyle = "rgba(250,0,0,"+w.alpha+")";
        gameCtx.fillRect(w.x - offsetX, w.y - offsetY, w.width, w.height);
    }
    this.drawPlayer = function(p, x, y) {
        var w = this.playerImg.width;
        var h = this.playerImg.height;
        gameCtx.translate(x, y);
        gameCtx.rotate((p.r+Math.PI/2));
        gameCtx.drawImage(this.playerImg, Math.round(-w / 2)+4, Math.round(-h / 2), w, h);
        gameCtx.rotate(-(p.r+Math.PI/2));
        gameCtx.translate(-x, -y);
        
        gameCtx.fillStyle = "black";
        gameCtx.font = "20px Arial";
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        var metrics = gameCtx.measureText(p.name);
        var textWidth = metrics.width;
        gameCtx.font = (50.0/textWidth * 20) + "px Arial";
        gameCtx.fillText(p.name, x, y - 40);
        
        gameCtx.fillStyle = "Red";
        gameCtx.fillRect(x - 25, y + 25, 50, 5);
        gameCtx.fillStyle = "Green";
        gameCtx.fillRect(x - 25, y + 25, 50*(p.health/100), 5);
    }
    this.drawBullet = function(b, x, y) {
        gameCtx.fillStyle = "Blue";
        gameCtx.beginPath();
        gameCtx.arc(x, y, b.size, 0, Math.PI*2, false); 
        gameCtx.fill();
    }
    
    this.keyUp = function(e) {
        if(e.keyCode == 39 || e.keyCode == 68 && this.right) {
            this.right = false;
            networking.SendBinary(this.getKeyBuffer(0, 0));
        }
        else if (e.keyCode == 37 || e.keyCode == 65 && this.left) {
            this.left = false;
            networking.SendBinary(this.getKeyBuffer(1, 0));
        } else if (e.keyCode == 38 || e.keyCode == 87 && this.up) {
            this.up = false;
            networking.SendBinary(this.getKeyBuffer(2, 0));
        } else if (e.keyCode == 40 || e.keyCode == 83 && this.down) {
            this.down = false;
            networking.SendBinary(this.getKeyBuffer(3, 0));
        }
    }
    this.keyDown = function(e) {
        if(e.keyCode == 39 || e.keyCode == 68 && !this.right) {
            this.right = true;
            networking.SendBinary(this.getKeyBuffer(0, 1));
        }
        else if (e.keyCode == 37 || e.keyCode == 65 && !this.left) {
            this.left = true;
            networking.SendBinary(this.getKeyBuffer(1, 1));
        } else if (e.keyCode == 38 || e.keyCode == 87 && !this.up) {
            this.up = true;
            networking.SendBinary(this.getKeyBuffer(2, 1));
        } else if (e.keyCode == 40 || e.keyCode == 83 && !this.down) {
            this.down = true;
            networking.SendBinary(this.getKeyBuffer(3, 1));
        }
    }
    this.mouseDown = function(e) {
        this.mousePressed = true;
        networking.SendBinary(this.getMouseBuffer(this.mousePressed));
    }
    this.mouseUp = function(e) {
        this.mousePressed = false;
        networking.SendBinary(this.getMouseBuffer(this.mousePressed));
    }
    this.mouseMove = function(x, y) {
        this.SetMousePos(x, y);
    }
    this.SetMousePos = function(x, y) {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
        networking.SendBinary(this.getMousePosBuffer(x, y));
    }
    //Class in a class
    this.Player = function() {
        this.uID = 0;
        this.name = "";
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.health = 100;
    }
    this.Bullet = function() {
        this.bulletID = 0;
        this.x = 0;
        this.y = 0;
        this.size = 0;
    }
    this.Wall = function(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    this.Lava = function(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.alpha = 0.3;
        this.forward = true;
        this.logic = function() {
            if (this.forward && this.alpha >= 0.9) {
                this.forward = false;
            } else if (!this.forward && this.alpha <= 0.5) {
                this.forward = true;
            }
            if (this.forward) {
                this.alpha += 0.01;
            } else {this.alpha -= 0.01;}
        }
    }
    this.RemovePlayer = function(p) {
        this.players.splice(this.players.indexOf(p), 1);
    }
    this.GetPlayerFromUID = function(uID) {
            for (var i = 0; i < this.players.length; i++) {
                    if (this.players[i].uID == uID) {return this.players[i];}
            }
            return null;
    }
    this.GetBulletFromID = function(ID) {
            for (var i = 0; i < this.bullets.length; i++) {
                    if (this.bullets[i].bulletID == ID) {return this.bullets[i];}
            }
            return null;
    }
    this.getKeyBuffer = function(key, data) {
        var buffer = new ArrayBuffer(2); //8int+8int
        var x = new DataView(buffer, 0);
        x.setInt8(0, key);
        x.setInt8(1, data);
        return buffer;
    }
    this.getMousePosBuffer = function(x, y) {
        var buffer = new ArrayBuffer(5); //float+float
        var d = new DataView(buffer, 0);
        d.setInt8(0, 4);
        d.setInt16(1, x);
        d.setInt16(3, y);
        return buffer;
    }
    this.getMouseBuffer = function(m) {
        var buffer = new ArrayBuffer(2);
        var d = new DataView(buffer, 0);
        d.setInt8(0, 5);
        d.setInt8(1, m);
        return buffer;
    }
}