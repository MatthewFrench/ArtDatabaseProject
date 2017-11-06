function Selector() {
    this.Message = function(title, message) {
    }
    
    this.BinaryMessage = function(buffer) {
    }
    
    this.draw = function(delta) {
        gameCtx.clearRect ( 0 , 0 , gameCtx.canvas.width , gameCtx.canvas.height );
        //Background
        gameCtx.fillStyle = "white";
        gameCtx.fillRect(0, 0, GameWidth, GameHeight);
        
        gameCtx.fillStyle = "black";
        gameCtx.font="30px Arial";
        gameCtx.textAlign = 'center';
        gameCtx.fillText("Select game:",GameWidth/2,50);
        
        //Block game
        roundRect(gameCtx, 20, GameHeight/2, 250, 50, 15, "black", "grey")
        gameCtx.fillStyle = "white";
        gameCtx.fillText("Block Game", 250/2 + 20, GameHeight/2+50/2+10);
        
        //Space Game
        gameCtx.fillStyle = "Black";
        roundRect(gameCtx, GameWidth/2-250/2, GameHeight/2-100, 250, 50, 15, "black", "grey")
        gameCtx.fillStyle = "white";
        gameCtx.fillText("SpaceCraft", GameWidth/2-250/2+125, GameHeight/2-100/2-15);
        
        //Shooting Game
        gameCtx.fillStyle = "Black";
        roundRect(gameCtx, GameWidth-20-250, GameHeight/2, 250, 50, 15, "black", "grey")
        gameCtx.fillStyle = "white";
        gameCtx.fillText("Shooting Game", 250/2 + GameWidth-20-250, GameHeight/2+50/2+10);
        
        this.redrawScreen = false;
    }
    this.keyUp = function(e) {
        if(e.keyCode == 39 || e.keyCode == 68 && this.right) {
            this.right = false;
        }
        else if (e.keyCode == 37 || e.keyCode == 65 && this.left) {
            this.left = false;
        } else if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32 && this.up) {
            this.up = false;
        } else if (e.keyCode == 40 || e.keyCode == 83 && this.down) {
            this.down = false;
        }
    }
    this.keyDown = function(e) {
        if(e.keyCode == 39 || e.keyCode == 68 && !this.right) {
            this.right = true;
        }
        else if (e.keyCode == 37 || e.keyCode == 65 && !this.left) {
            this.left = true;
        } else if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32 && !this.up) {
            this.up = true;
        } else if (e.keyCode == 40 || e.keyCode == 83 && !this.down) {
            this.down = true;
        }
    }
    this.mouseDown = function(e, x, y) {
        this.mousePressed = true;
        this.mousePosition.x = x;
        this.mousePosition.y = GameHeight-y;
        
        
    }
    this.mouseUp = function(e) {
        this.mousePressed = false;
        var x = this.mousePosition.x;
        var y = this.mousePosition.y;
        if ( x >= 20 && y >= GameHeight/2-50 && x <= 20+250 && y <= GameHeight/2) {
            networking.Send("Game", "Block");
        }
        if ( x >= GameWidth/2-250/2 && y >= GameHeight/2+50 && x <= GameWidth/2-250/2+250 && y <= GameHeight/2+50+50) {
            networking.Send("Game", "SpaceCraft");
        }
        if ( x >= GameWidth-20-250 && y >= GameHeight/2-50 && x <= GameWidth-20 && y <= GameHeight/2) {
            networking.Send("Game", "Shooter");
        }
    }
    this.mouseMove = function(x, y) {
        this.mousePosition.x = x;
        this.mousePosition.y = GameHeight-y;
    }
    //Variables
    this.redrawScreen = true;
    this.up = false, this.down = false, this.right = false, this.left = false;
    this.mousePosition = {};
    this.mousePressed = false;
}
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}