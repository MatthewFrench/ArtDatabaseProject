function SpaceCraft() {
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
        gameCtx.fillText("Space Craft Game",GameWidth/2,50);
        gameCtx.fillText("In Construction",GameWidth/2,50+40);
        
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