module.exports.BlockMap= function() {
    //Block map needs to hold  infinite blocks in all directions
    this.blocks = {};
    //this.blockArray = [];
    this.backgroundBlocks = {};
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;
    this.totalBlocks = 0;
    this.PlaceBlock = function(x, y, blockVal) {
        if (this.blocks[x] == undefined) {
            this.blocks[x] = {};
        }
        //if (blockVal == 0) {
        //    this.blocks[x][y] == 0;
        //} else {
            this.blocks[x][y] = blockVal;
            if (x >= this.right) {this.right = x+1;}
            if (x <= this.left) {this.left = x-1;}
            if (y >= this.up) {this.up = y+1;}
            if (y <= this.down) {this.down = y-1;}  
        //}
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
        //if (blockVal == 0) {
        //    this.blocks[x][y] == 0;
        //} else {
            this.backgroundBlocks[x][y] = blockVal;
            if (x >= this.right) {this.right = x+1;}
            if (x <= this.left) {this.left = x-1;}
            if (y >= this.up) {this.up = y+1;}
            if (y <= this.down) {this.down = y-1;}  
        //}
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