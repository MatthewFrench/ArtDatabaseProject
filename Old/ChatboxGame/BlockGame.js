function BlockGame() {
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
    }
    
    this.BinaryMessage = function(buffer) {
        switch(buffer.getUint8(0))
        {
            case 1: //Update
                var p = this.GetPlayerFromUID(buffer.getUint16(1));
                p.x = buffer.getFloat32(3);
                p.y = buffer.getFloat32(7);
                this.redrawScreen = true;
                break;
            case 2: //Direction 0 = left, 1 = right
                var p = this.GetPlayerFromUID(buffer.getUint16(1));
                p.direction = buffer.getUint8(3);
                this.redrawScreen = true;
                break;
            case 3: //Update individual block
                var x = buffer.getInt32(1);
                var y = buffer.getInt32(5);
                var val = buffer.getUint16(9);
                this.blockMap.PlaceBlock(x, y, val);
                var tiles = this.blockGraphicController.GetTilesForBlock(x, y);
                for (var i = 0; i < tiles.length; i++) {
                    var t = tiles[i];
                    t.DrawTile(x, y, val);
                }
                this.redrawScreen = true;
                break;
            case 4: //Update blocks
                var len = buffer.getUint32(1);
                var offset = 5;
                for (var i = 0; i <len; i++) {
                    var x = buffer.getInt32(offset);
                    var y = buffer.getInt32(offset + 4);
                    var val = buffer.getUint16(offset + 8);
                    this.blockMap.PlaceBlock(x, y, val);
                    offset += 10;
                    
                    var tiles = this.blockGraphicController.GetTilesForBlock(x, y);
                    for (var e = 0; e < tiles.length; e++) {
                        var t = tiles[e];
                        t.DrawTile(x, y, val);
                    }
                }
                this.redrawScreen = true;
                break;
            case 6: //Update individual background block
                var x = buffer.getInt32(1);
                var y = buffer.getInt32(5);
                var val = buffer.getUint16(9);
                this.blockMap.PlaceBackgroundBlock(x, y, val);
                var tiles = this.blockGraphicController.GetTilesForBlock(x, y);
                for (var i = 0; i < tiles.length; i++) {
                    var t = tiles[i];
                    t.DrawTile(x, y, val);
                }
                this.redrawScreen = true;
                break;
            case 5: //Update background blocks
                var len = buffer.getUint32(1);
                var offset = 5;
                for (var i = 0; i <len; i++) {
                    var x = buffer.getInt32(offset);
                    var y = buffer.getInt32(offset + 4);
                    var val = buffer.getUint16(offset + 8);
                    this.blockMap.PlaceBackgroundBlock(x, y, val);
                    offset += 10;
                    
                    var tiles = this.blockGraphicController.GetTilesForBlock(x, y);
                    for (var e = 0; e < tiles.length; e++) {
                        var t = tiles[e];
                        t.DrawTile(x, y, val);
                    }
                }
                this.redrawScreen = true;
                break;
            default:
        }
    }
    
    this.draw = function(delta) {
        if (this.mousePressed && this.palletPressed == false) {
            this.SetTileEdit();
        }
        
        var p = this.GetPlayerFromUID(uID);
        //this.redrawScreen &&
        if (p != null) {
            var offsetX = Math.round(p.x*this.blockSize - GameWidth/2);
            var offsetY = Math.round(p.y*this.blockSize - GameHeight/2);
            
            gameCtx.clearRect ( 0 , 0 , gameCtx.canvas.width , gameCtx.canvas.height );
            
            //Draw blocks
            this.blockGraphicController.Draw();
            
            for (var i = 0; i < this.players.length; i++) {
                var p2 = this.players[i];
                if (p2 != p) {
                    this.drawPlayer(p2,p2.x*this.blockSize - offsetX, p2.y*this.blockSize - offsetY, 0);
                }
            }
            
            this.drawPlayer(p, Math.round(GameWidth/2), Math.round(GameHeight/2, 0));
            
            //Draw block selector
            for (var i = 0; i < this.blockImages.length; i++) {
                gameCtx.fillStyle = "rgba(255,255,255,1)";
                gameCtx.fillRect(20+i*20, GameHeight-40, 20, 20);
                if (this.selectedBlock != i) {
                    gameCtx.strokeStyle = "rgba(0,0,0,0.4)";
                } else {
                    gameCtx.strokeStyle = "rgb(0,0,0)";
                }
                gameCtx.strokeRect(20+i*20, GameHeight-40, 20, 20);
                if (i != 0) {
                    gameCtx.drawImage(this.blockImages[i], 20+i*20+5, GameHeight-40+5);
                }
            }
            
            //Draw minimap
            this.UpdateMiniMap();
            gameCtx.fillStyle = "rgba(255,255,255,1.0)";
            gameCtx.fillRect(GameWidth-11-this.minimapWidth, GameHeight-11-this.minimapHeight, this.minimapWidth+2, this.minimapHeight+2);
            
            gameCtx.drawImage(this.minimap, GameWidth-10-this.minimapWidth, GameHeight-10-this.minimapHeight);
            gameCtx.strokeStyle = "rgba(0,0,0,0.4)";
            gameCtx.strokeRect(GameWidth-11-this.minimapWidth, GameHeight-11-this.minimapHeight, this.minimapWidth+2, this.minimapHeight+2);
            
            this.redrawScreen = false;
        }
    }
    //Minimap needs to be updated, can instead draw the scaled versions of the tiles
    this.miniMapUpdateX = 0;
    this.miniMapUpdateY = 0;
    this.miniMapUpdateAmount = 50;
    this.UpdateMiniMap = function() {
        //Minimap is 120 x 80
        var p = this.GetPlayerFromUID(uID);
        var centerX = Math.floor(p.x);
        var centerY = Math.floor(p.y)+15;
        var left = centerX-this.minimapWidth/2;
        var bottom = centerY-this.minimapHeight/2;
        var right = centerX+this.minimapWidth/2;
        var top = centerY+this.minimapHeight/2;
        /*
        var amount = 0;
        var cont = false;
        for (var x = left+this.miniMapUpdateX; x < right; x++) {
            for (var y = bottom+this.miniMapUpdateY; y < top; y++) {
                amount += 1;
                if (amount >= this.miniMapUpdateAmount) {
                    this.miniMapUpdateX = x-left;
                    this.miniMapUpdateY = y-bottom;
                    x = right;
                    y = top;
                    cont = true;
                }
                var val = this.blockMap.GetBlock(x, y);
                //if (val != 0) {
                    var pixel = this.blockImages[val].pixel;
                    this.minimapCtx.drawImage(pixel, x-left, this.minimapHeight/2-(y-(centerY)));
                //}
            }
            if (!cont) {
                this.miniMapUpdateY = 0;
            }
        }
        if (!cont) {
            this.miniMapUpdateX = 0;
            this.miniMapUpdateY = 0;
        }
        */
        var w = this.minimapCtx.canvas.width;
        var h = this.minimapCtx.canvas.height;
        this.minimapCtx.clearRect ( 0 , 0 , w, h );
        var scale = 10;
        var scaleSize = this.blockGraphicController.tileSize/scale;
        for (var i = 0; i < this.blockGraphicController.tiles.length; i++) {
            var t = this.blockGraphicController.tiles[i];
            //t.Draw();
            //Math.floor(t.position.x)
            //Math.floor(t.position.y)
            var x = Math.floor(t.position.x/scale + w/4)+0.5;
            var y = Math.floor(t.position.y/scale + h/4)+0.5;
            if (x + scaleSize > 0 && y + scaleSize > 0 && x < w && y < h) {
                this.minimapCtx.drawImage(t.canvas, x, y,scaleSize, scaleSize);
            }
        }
    }
    this.drawBlock = function(ctx, x, y, blockVal) {
        ctx.drawImage(this.blockImages[blockVal], x - this.blockSize/2, GameHeight-y + this.blockSize/2);
    }
    this.drawPlayer = function(p, x, y) {
        var playerImg;
        if (p.direction == 0) {playerImg = this.playerImgLeft;}
        if (p.direction == 1) {playerImg = this.playerImgRight;}
        var w = playerImg.width;
        var h = playerImg.height;
        y = GameHeight - y;
        gameCtx.translate(x, y);
        gameCtx.rotate((p.r+Math.PI/2));
        gameCtx.drawImage(playerImg, Math.round(-w / 2), Math.round(-h / 2), w, h);
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
    }
    this.SetSelectedBlock = function(s) {
        if (this.selectedBlock != s && this.selectedBlock != 0) {
            this.previousSelectedBlock = this.selectedBlock;
        }
        this.selectedBlock = s;
        if (this.selectedBlock > this.blockImages.length-1) {
            this.selectedBlock = this.blockImages.length-1;
        }
        if (this.selectedBlock < 0) {
            this.selectedBlock = 0;
        }
        networking.SendBinary(this.getSelectedBlockBuffer(this.selectedBlock));
        this.redrawScreen = true;
    }
    this.keyUp = function(e) {
        if(e.keyCode == 39 || e.keyCode == 68 && this.right) {
            this.right = false;
            networking.SendBinary(this.getKeyBuffer(0, 0));
        }
        else if (e.keyCode == 37 || e.keyCode == 65 && this.left) {
            this.left = false;
            networking.SendBinary(this.getKeyBuffer(1, 0));
        } else if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32 && this.up) {
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
        } else if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32 && !this.up) {
            this.up = true;
            networking.SendBinary(this.getKeyBuffer(2, 1));
        } else if (e.keyCode == 40 || e.keyCode == 83 && !this.down) {
            this.down = true;
            networking.SendBinary(this.getKeyBuffer(3, 1));
        }
        if (e.keyCode == 81) { //q
            if (this.selectedBlock != 0) {
                this.previousSelectedBlock2 = this.previousSelectedBlock;
                this.previousSelectedBlock = this.selectedBlock;
            }
            this.SetSelectedBlock(0);
        }
        if (e.keyCode == 69) { //e
            var s = this.selectedBlock;
            this.SetSelectedBlock(this.previousSelectedBlock);
            if (s != 0) {
                this.previousSelectedBlock = s;
            } else {this.previousSelectedBlock = this.previousSelectedBlock2}
        }
    }
    this.mouseDown = function(e, x, y) {
        this.mousePressed = true;
        this.mousePosition.x = x;
        this.mousePosition.y = GameHeight-y;
        
        if (x >= 20 && x <= 20+this.blockImages.length*20 && y <= GameHeight-20 && y >= GameHeight-40) {
            this.SetSelectedBlock(Math.floor((x-20)/20));
            this.redrawScreen = true;
            this.palletPressed = true;
        } else {
            this.SetTileEdit();
        }
    }
    this.mouseUp = function(e) {
        this.mousePressed = false;
        this.palletPressed = false;
    }
    this.mouseMove = function(x, y) {
        this.mousePosition.x = x;
        this.mousePosition.y = GameHeight-y;
        if (this.palletPressed) {
            if (x >= 20 && x <= 20+this.blockImages.length*20 && y <= GameHeight-20 && y >= GameHeight-40) {
                this.SetSelectedBlock(Math.floor((x-20)/20));
                this.redrawScreen = true;
            }
        }
    }
    this.SetTileEdit = function() {
        var p = this.GetPlayerFromUID(uID);
        if (p != null) {
            var x = (this.mousePosition.x - GameWidth/2-2)/this.blockSize;
            var y = (this.mousePosition.y - GameHeight/2+1)/this.blockSize;
            x += p.x;
            y += p.y;
            x = Math.ceil(x-0.5);
            y = Math.ceil(y+0.5);
            if (this.tileX != x || this.tileY != y) {
                this.tileX = x;
                this.tileY = y;
                networking.SendBinary(this.getTileEditBuffer(this.tileX, this.tileY));
            }
        }
    }
    //Class in a class
    this.Player = function() {
        this.uID = 0;
        this.name = "";
        this.x = 0;
        this.y = 0;
        this.direction = 0;
    }
    this.BlockMap= function() {
        //Block map needs to hold  infinite blocks in all directions
        this.blocks = {};
        this.backgroundBlocks = {};
        this.left = 0;
        this.right = 0;
        this.up = 0;
        this.down = 0;
        this.PlaceBlock = function(x, y, blockVal) {
            if (this.blocks[x] == undefined) {
                this.blocks[x] = {};
            }
            this.blocks[x][y] = blockVal;
            if (x >= this.right) {this.right = x+1;}
            if (x <= this.left) {this.left = x-1;}
            if (y >= this.up) {this.up = y+1;}
            if (y <= this.down) {this.down = y-1;}
        }
        this.GetBlock = function(x, y) {
            if (this.blocks[x] == undefined) {
                return 0;
            }
            if (this.blocks[x][y] == undefined) {
                return 0;
            }
            return this.blocks[x][y];
        }
        this.PlaceBackgroundBlock = function(x, y, blockVal) {
            if (this.backgroundBlocks[x] == undefined) {
                this.backgroundBlocks[x] = {};
            }
            this.backgroundBlocks[x][y] = blockVal;
            if (x >= this.right) {this.right = x+1;}
            if (x <= this.left) {this.left = x-1;}
            if (y >= this.up) {this.up = y+1;}
            if (y <= this.down) {this.down = y-1;}
        }
        this.GetBackgroundBlock = function(x, y) {
            if (this.backgroundBlocks[x] == undefined) {
                return 0;
            }
            if (this.backgroundBlocks[x][y] == undefined) {
                return 0;
            }
            return this.backgroundBlocks[x][y];
        }
        this.GetWidth = function() {
            return this.right - this.left - 1;
        }
        this.GetHeight = function() {
            return this.up - this.down - 1;
        }
    }
    this.BlockGraphicController = function(game) {
        this.game = game;
        this.tileSize = 20 * this.game.blockSize; //200pixels per tile
        this.tiles = []; //Single array of tiles
        this.offset = {x: 0, y:0};
        this.tileMinX = -2;
        this.tileMaxX = 5+1;
        this.tileMinY = -1;
        this.tileMaxY = 3+1;
        this.Init = function () {
            //Make the 2D array of tiles
            for (var x = this.tileMinX; x <= this.tileMaxX; x+=1) {
                for (var y = this.tileMinY; y <= this.tileMaxY; y+=1) {
                    var t = new this.GraphicTile(this.tileSize, this.game);
                    this.tiles.push(t);
                }
            }
            this.Reset();
        }
        this.Reset = function() {
            var p = this.game.GetPlayerFromUID(uID);
            if (p != null) {
                var x = p.x*this.game.blockSize;// - GameWidth/2;
                var y = p.y*this.game.blockSize;// - GameHeight/2;
                //Offset should equal top left of screen
                this.offset.x = x;
                this.offset.y = y; 
            }
            //Now loop through and place tiles
            var tileCount = 0;
            for (var x = this.tileMinX; x <= this.tileMaxX; x+=1) {
                for (var y = this.tileMinY; y <= this.tileMaxY; y+=1) {
                    var t = this.tiles[tileCount];
                    tileCount += 1;
                    //Set Position of tile
                    t.position.x = x*this.tileSize;
                    t.position.y = y*this.tileSize;
                    t.Reset();
                }
            }
        }
        //var left = Math.floor((p.x*this.game.blockSize - GameWidth/2)/this.game.blockSize);
        //var right = Math.ceil((p.x*this.game.blockSize + GameWidth/2)/this.game.blockSize);
        //var top = Math.ceil((p.y*this.game.blockSize + GameHeight/2)/this.game.blockSize)+1;
        //var bottom = Math.floor((p.y*this.game.blockSize - GameHeight/2)/this.game.blockSize);
        this.Draw = function () {
            var p = this.game.GetPlayerFromUID(uID);
            
            var x = p.x*this.game.blockSize;// - GameWidth/2;
            var y = p.y*this.game.blockSize;// - GameHeight/2;
            
            //Detect if need to reset
            if (Math.abs(this.offset.x-x) > GameWidth || Math.abs(this.offset.y-y) > GameHeight) {
                this.Reset();
            } else if (this.offset.x != x || this.offset.y != y) {
                //Calculate push and set offset
                this.Push(this.offset.x-x, y-this.offset.y);
                this.offset.x = x;
                this.offset.y = y;
            }
            
            //Draw tiles
            for (var i = 0; i < this.tiles.length; i++) {
                var t = this.tiles[i];
                t.Draw();
            }
            
            //Draw red square in top left for reference
            //gameCtx.fillStyle = "rgba(250,0,0,0.9)";
            //gameCtx.fillRect(left, top, this.tileSize, this.tileSize);
            //gameCtx.strokeStyle = "rgba(0,255,255,0.9)";
            //gameCtx.strokeRect(this.tileMinX*this.tileSize, this.tileMinY*this.tileSize, (this.tileMaxX-this.tileMinX)*this.tileSize, (this.tileMaxY-this.tileMinY)*this.tileSize);
        }
        this.Push = function(xAmount, yAmount) {
            for (var i = 0; i < this.tiles.length; i++) {
                var t = this.tiles[i];
                t.position.x += xAmount;
                t.position.y += yAmount;
                
                if (t.position.x > this.tileMaxX*this.tileSize) {
                    var off = t.position.x - this.tileMaxX*this.tileSize;
                    t.position.x = this.tileMinX*this.tileSize-this.tileSize+off;
                    t.Reset();
                }
                if (t.position.x < this.tileMinX*this.tileSize-this.tileSize) {
                    var off = t.position.x - (this.tileMinX*this.tileSize-this.tileSize);
                    t.position.x = this.tileMaxX*this.tileSize+off;
                    t.Reset();
                }
                if (t.position.y > this.tileMaxY*this.tileSize) {
                    var off = t.position.y - this.tileMaxY*this.tileSize;
                    t.position.y = this.tileMinY*this.tileSize-this.tileSize+off;
                    t.Reset();
                }
                if (t.position.y < this.tileMinY*this.tileSize-this.tileSize) {
                    var off = t.position.y - (this.tileMinY*this.tileSize-this.tileSize);
                    t.position.y = this.tileMaxY*this.tileSize+off;
                    t.Reset();
                }
            }
        }
        //A block could span 2 tiles
        this.GetTilesForBlock = function (x, y) {
            var arr = [];
            for (var i = 0; i < this.tiles.length; i++) {
                var t = this.tiles[i];
                if (t.Contains(x, y)) {
                    arr.push(t);
                }
            }
            return arr;
        }
        this.GraphicTile = function(size, game) { //Graphic tile class
            this.game = game;
            //this.topLeft = {x:0, y:0};
            this.canvas = document.createElement('canvas');
            this.canvas.width  = size;
            this.canvas.height = size;
            this.ctx=this.canvas.getContext("2d");
            this.position = {x: 0, y:0};
            this.redraw = true;
            this.size = size;
            this.range = {left:0, right:0, top:0, bottom:0};
            this.Reset = function() {
                this.redraw = true;
                this.UpdateRange();
            }
            this.UpdateRange = function() {
                this.range.left = 0;
                this.range.right = 0;
                this.range.bottom = 0;
                this.range.top = 0;
                //Player is always in the middle of the screen
                var p = this.game.GetPlayerFromUID(uID);
                if (p != null) {
                    var Xoffset = this.position.x - GameWidth/2;
                    var Yoffset = GameHeight/2-this.position.y;
                        
                    this.range.left = Math.floor(Xoffset/this.game.blockSize + p.x);
                    this.range.right = Math.floor(Xoffset/this.game.blockSize + p.x + this.size/this.game.blockSize);
                    this.range.bottom = Math.floor(p.y+Yoffset/this.game.blockSize-this.size/this.game.blockSize);
                    this.range.top = Math.floor(p.y+Yoffset/this.game.blockSize);
                }
            }
            this.Draw = function() {
                //this.ctx.fillStyle = "rgba(0,0,0,0.4)";
                //this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                if (this.redraw) {
                    this.redraw = false;
                    this.ctx.clearRect(0, 0, this.size, this.size);
                    //this.ctx.strokeStyle = "rgba(0,255,255,0.9)";
                    //this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    //Draw blocks
                    if (this.range.left == 0 && this.range.right == 0) {
                        this.UpdateRange();
                    }
                    
                    for (var x = Math.floor(this.range.left)-1; x < Math.ceil(this.range.right)+1; x++) {
                        for (var y = Math.floor(this.range.bottom)+1; y < Math.ceil(this.range.top)+2; y++) {
                            var blockVal = this.game.blockMap.GetBlock(x, y);
                            if (blockVal != 0) {
                                //this.ctx.fillStyle = "rgba(0,0,0,0.4)";
                                //this.ctx.fillRect((x-this.range.left) * this.game.blockSize - this.game.blockSize/2, this.size-(y-this.range.bottom)*this.game.blockSize + this.game.blockSize/2, this.game.blockSize, this.game.blockSize);
                    
                                this.ctx.drawImage(this.game.blockImages[blockVal], Math.floor((x-this.range.left) * this.game.blockSize - this.game.blockSize/2), Math.floor(this.size-(y-this.range.bottom)*this.game.blockSize + this.game.blockSize/2));
                            }
                        }
                    }
                }
                var x = Math.floor(this.position.x);
                var y = Math.floor(this.position.y);
                if (x+this.size > 0 && y+this.size > 0 && x < GameWidth && y < GameHeight) {
                    gameCtx.drawImage(this.canvas, x, y);
                }
            }
            this.DrawTile = function(x, y, val) {
                this.ctx.drawImage(this.game.blockImages[val], Math.floor((x-this.range.left) * this.game.blockSize - this.game.blockSize/2), Math.floor(this.size-(y-this.range.bottom)*this.game.blockSize + this.game.blockSize/2));
            }
            this.Contains = function(x, y) {
                if (x >= Math.floor(this.range.left)-1 && x < Math.ceil(this.range.right)+1 && y >= Math.floor(this.range.bottom)+1 && y < Math.ceil(this.range.top)+2) {
                    return true;
                }
                return false;
            }
        }
        this.Init();
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
    this.getKeyBuffer = function(key, data) {// 0, 1, 2, 3
        var buffer = new ArrayBuffer(2); //8int+8int
        var x = new DataView(buffer, 0);
        x.setInt8(0, key);
        x.setInt8(1, data);
        return buffer;
    }
    this.getTileEditBuffer = function(x, y) { // 4
        var buffer = new ArrayBuffer(9); //float+float
        var d = new DataView(buffer, 0);
        d.setInt8(0, 4);
        d.setInt32(1, x);
        d.setInt32(5, y);
        return buffer;
    }
    this.getSelectedBlockBuffer = function(s) {
        var buffer = new ArrayBuffer(2); //int
        var d = new DataView(buffer, 0);
        d.setInt8(0, 5);
        d.setUint8(1, s);
        return buffer;
    }
    this.GenerateMapJSON = function() {
        console.log(JSON.stringify(this.blockMap.blocks));
    }
    //Variables
    this.blockSize = 10;
    this.redrawScreen = true;
    this.playerImgLeft = new Image();this.playerImgLeft.onload = function() {
        this.redrawScreen = true;
      };this.playerImgLeft.src = "Images/champLeft.png";
    this.playerImgRight = new Image();this.playerImgRight.onload = function() {
        this.redrawScreen = true;
      };this.playerImgRight.src = "Images/champRight.png";
    this.players = new Array();
    this.up = false, this.down = false, this.right = false, this.left = false;
    this.mousePosition = {};
    this.mousePressed = false;
    this.blockMap = new this.BlockMap();
    this.tileX = null;
    this.tileY = null;
    this.blockImages = InitializeBlocks(this.blockSize);
    this.blockGraphicController = new this.BlockGraphicController(this);
    this.selectedBlock = 1;
    this.palletPressed = false;
    this.previousSelectedBlock = 1;
    this.previousSelectedBlock2 = 1;
    
    this.minimap = document.createElement('canvas');
    this.minimapWidth = 150;
    this.minimapHeight = 100
    this.minimap.width = this.minimapWidth;
    this.minimap.height = this.minimapHeight;
    this.minimapCtx = this.minimap.getContext('2d');
}
var GetPixelForBlock = function(canvas) {
    var c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    c.getContext("2d").drawImage(canvas, 0, 0, 1, 1);
    return c;
}
var InitializeBlocks = function(blockSize) {
    var arr = new Array(0);
    //block 0
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgba(255,255,255,1.0)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 1
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    ctx.strokeStyle = "rgba(0,255,255,0.9)";
    ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 2
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(139,69,19)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 3
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(139,137,137)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 4
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 5
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(0,0,255)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 6
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(50,205,50)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 7
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 8
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(255,165,0)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 9
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(255,105,180)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 10
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(160,32,240)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    //block 11
    var c = document.createElement('canvas');
    c.width  = blockSize;
    c.height = blockSize;
    var ctx=c.getContext("2d");
    ctx.fillStyle = "rgb(255,0, 0)";
    ctx.fillRect(0, 0, blockSize, blockSize);
    //ctx.strokeStyle = "rgba(0,255,255,0.9)";
    //ctx.strokeRect(0, 0, blockSize, blockSize);
    arr.push(c);
    c.pixel = GetPixelForBlock(c);
    
    return arr;
}