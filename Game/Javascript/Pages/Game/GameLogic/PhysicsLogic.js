const Player_Width_Tiles = 2;
//Player height is 5 but subtract a tiny bit to allow physics to pass it underneath tight spaces.
const Player_Height_Tiles = 4.9;
const Gravity = 0.01;
const Player_Move_Speed = 0.01;
const Player_Jump_Speed = 0.4;
const Ground_Friction = 0.98;
const Cut_Off = 0.0001;

export class PhysicsLogic {
    constructor() {
    }
    logic = (board) => {
        this.unhighlightAllTiles(board);
        let players = board.getPlayers();
        //Loop through all players
        players.forEach((player)=>{
            //Add gravity and friction
            player.speedY -= Gravity;
            player.speedX *= Ground_Friction;
            //Cut off horizontal speed after a point
            if (Math.abs(player.speedX) <= Cut_Off) {
                player.speedX = 0;
            }

            //Check for collision
            let left = Math.floor(player.x - Player_Width_Tiles/2 + 0.5);
            let right = Math.floor(player.x + Player_Width_Tiles/2);
            let bottom = Math.floor(player.y);
            let top = Math.floor(player.y + Player_Height_Tiles);

            let onGround = this.isHorizontalCollision(board, left, right, bottom);
            let bottomNextStep = Math.floor(player. y + player.speedY);
            let nextStepOnGround = this.isHorizontalCollision(board, left, right, bottomNextStep);

            //Check if on ground
            if ((onGround || nextStepOnGround) && player.speedY < 0) {
                player.speedY = 0;
                //Set the tile to be above the ground tile
                if (onGround) {
                    this.highlightTiles(this.getTilesInHorizontalCollision(board, left, right, bottom));
                    player.y = bottom + 1;
                } else {
                    this.highlightTiles(this.getTilesInHorizontalCollision(board, left, right, bottomNextStep));
                    player.y = bottomNextStep + 1;
                }
                bottom = Math.floor(player.y);
                top = Math.floor(player.y + Player_Height_Tiles);
            }
            onGround = onGround || nextStepOnGround;

            //Check to see if we're hitting a tile from above
            let topNextStep = Math.floor(player.y + Player_Height_Tiles + player.speedY);
            let topSideHit = this.isHorizontalCollision(board, left, right, top);
            let nextStepTopSideHit = this.isHorizontalCollision(board, left, right, topNextStep);
            if ((topSideHit || nextStepTopSideHit) && player.speedY > 0) {
                player.speedY = 0;
                if (topSideHit) {
                    this.highlightTiles(this.getTilesInHorizontalCollision(board, left, right, top));
                    player.y = top - Player_Height_Tiles;
                } else {
                    this.highlightTiles(this.getTilesInHorizontalCollision(board, left, right, topNextStep));
                    player.y = topNextStep - Player_Height_Tiles;
                }

                bottom = Math.floor(player.y);
                top = Math.floor(player.y + Player_Height_Tiles);
            }

            //Apply movement
            if (player.movingLeft) {
                player.speedX -= Player_Move_Speed;
            }
            if (player.movingRight) {
                player.speedX += Player_Move_Speed;
            }
            if (player.jumping && onGround && player.speedY < Player_Jump_Speed) {
                player.speedY += Player_Jump_Speed;
            }

            //Do side collisions
            let leftNextStep = Math.floor(player.x - Player_Width_Tiles/2 + 0.5 + player.speedX);
            let leftSideHit = this.isVerticalCollision(board, left, bottom, top);
            //Ignore the first step so it can climb stairs automatically (bottom + 1)
            let nextStepLeftSideHit = this.isVerticalCollision(board, leftNextStep, bottom + 1, top);
            if ((leftSideHit || nextStepLeftSideHit) && player.speedX < 0) {
                player.speedX = 0;
                if (leftSideHit) {
                    this.highlightTiles(this.getTilesInVerticalCollision(board, left, bottom, top));
                    player.x = left + 1 + 0.5;
                } else {
                    this.highlightTiles(this.getTilesInVerticalCollision(board, leftNextStep, bottom, top));
                    player.x = leftNextStep + 1 + 0.5;
                }
            }
            //Check right side collisions
            let rightNextStep = Math.floor(player.x + Player_Width_Tiles/2 + 0.5 + player.speedX);
            let rightSideHit = this.isVerticalCollision(board, right, bottom, top);
            //Ignore the first step so it can climb stairs automatically (bottom + 1)
            let nextStepRightSideHit = this.isVerticalCollision(board, rightNextStep, bottom + 1, top);
            if ((rightSideHit || nextStepRightSideHit) && player.speedX > 0) {
                player.speedX = 0;
                if (rightSideHit) {
                    this.highlightTiles(this.getTilesInVerticalCollision(board, right, bottom, top));
                    player.x = right - 1 - 0.5;
                } else {
                    this.highlightTiles(this.getTilesInVerticalCollision(board, rightNextStep, bottom, top));
                    player.x = rightNextStep - 1 - 0.5;
                }
            }
            //Add player speed to position
            player.x += player.speedX;
            player.y += player.speedY;
        });
    };

    unhighlightAllTiles = (board) => {
        board.tiles.forEach((x) => {
            x.forEach((tile)=>{
                if (tile.highlighted) {
                    tile.highlighted = false;
                    tile.r = tile.originalR;
                    tile.g = tile.originalG;
                    tile.b = tile.originalB;
                    tile.a = tile.originalA;
                }
            });
        });
    };

    highlightTiles = (tiles) => {
        for (let tile of tiles) {
            if (!tile.highlighted) {
                tile.highlighted = true;
                tile.originalR = tile.r;
                tile.originalG = tile.g;
                tile.originalB = tile.b;
                tile.originalA = tile.a;
                tile.r = 1;
                tile.g = 0;
                tile.b = 0;
                tile.a = 1;
            }
        }
    };

    getTilesInHorizontalCollision = (board, x1, x2, y) => {
        let tiles = [];
        for (let x = x1; x <= x2; x++) {
            let tile = board.getTile(x, y);
            if (tile !== null && tile.a !== 0) {
                tiles.push(tile);
            }
        }
        return tiles;
    };

    isHorizontalCollision = (board, x1, x2, y) => {
        for (let x = x1; x <= x2; x++) {
            let tile = board.getTile(x, y);
            if (tile !== null && tile.a !== 0) {
                return true;
            }
        }
        return false;
    };


    getTilesInVerticalCollision = (board, x, y1, y2) => {
        let tiles = [];
        for (let y = y1; y <= y2; y++) {
            let tile = board.getTile(x, y);
            if (tile !== null && tile.a !== 0) {
                tiles.push(tile);
            }
        }
        return tiles;
    };

    isVerticalCollision = (board, x, y1, y2) => {
        for (let y = y1; y <= y2; y++) {
            let tile = board.getTile(x, y);
            if (tile !== null && tile.a !== 0) {
                return true;
            }
        }
        return false;
    };

}