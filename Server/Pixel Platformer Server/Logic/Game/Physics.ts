import {Board} from "./Board";

const Player_Width_Tiles = 2;
//Player height is 5 but subtract a tiny bit to allow physics to pass it underneath tight spaces.
const Player_Height_Tiles = 4.9;
const Gravity = 0.02;
const Player_Move_Speed = 0.01;
const Player_Jump_Speed = 0.8;
const Ground_Friction = 0.98;
const Cut_Off = 0.0001;

const Solid_Tile_Type = 4;

export class Physics {
    board: Board;
    constructor(board) {this.board = board;}
    logic = (delta) => {
        console.log('Delta: ' + delta);
        while (delta >= 1.75) {
            this.runPhysics(1.0);
            delta -= 1.0;
        }
        this.runPhysics(delta);
    };

    runPhysics = (delta) => {
        let players = this.board.getPlayers();
        //Loop through all players
        players.forEach((player)=>{
            let playerGameData = player.getGameData();
            let speedX = playerGameData.getSpeedX();
            let speedY = playerGameData.getSpeedY();
            let x = playerGameData.getX();
            let y = playerGameData.getY();
            let movingLeft = playerGameData.getMovingLeft();
            let movingRight = playerGameData.getMovingRight();
            let jumping = playerGameData.getJumping();
            //Add gravity and friction
            speedY -= Gravity * delta;
            speedX *= Ground_Friction * delta;
            //Cut off horizontal speed after a point
            if (Math.abs(speedX) <= Cut_Off) {
                speedX = 0;
            }

            //Check for collision
            let left = Math.floor(x - Player_Width_Tiles/2 + 0.5);
            let right = Math.floor(x + Player_Width_Tiles/2);
            let bottom = Math.floor(y);
            let top = Math.floor(y + Player_Height_Tiles);

            let onGround = this.isHorizontalCollision(left, right, bottom);
            let bottomNextStep = Math.floor( y + speedY);
            let nextStepOnGround = this.isHorizontalCollision(left, right, bottomNextStep);

            //Check if on ground
            if ((onGround || nextStepOnGround) && speedY < 0) {
                speedY = 0;
                //Set the tile to be above the ground tile
                if (onGround) {
                    y = bottom + 1;
                } else {
                    y = bottomNextStep + 1;
                }
                bottom = Math.floor(y);
                top = Math.floor(y + Player_Height_Tiles);
            }
            onGround = onGround || nextStepOnGround;

            //Check to see if we're hitting a tile from above
            let topNextStep = Math.floor(y + Player_Height_Tiles + speedY);
            let topSideHit = this.isHorizontalCollision(left, right, top);
            let nextStepTopSideHit = this.isHorizontalCollision(left, right, topNextStep);
            if ((topSideHit || nextStepTopSideHit) && speedY > 0) {
                speedY = 0;
                if (topSideHit) {
                    y = top - Player_Height_Tiles;
                } else {
                    y = topNextStep - Player_Height_Tiles;
                }

                bottom = Math.floor(y);
                top = Math.floor(y + Player_Height_Tiles);
            }

            //Apply movement
            if (movingLeft) {
                //Apply a massive slowdown to allow easy mid-air moving
                if (speedX > 0) {
                    speedX *= 0.9;
                }
                speedX -= Player_Move_Speed;
            }
            if (movingRight) {
                //Apply a massive slowdown to allow easy mid-air moving
                if (speedX < 0) {
                    speedX *= 0.9;
                }
                speedX += Player_Move_Speed;
            }
            if (jumping && onGround && speedY < Player_Jump_Speed) {
                speedY += Player_Jump_Speed;
            }

            //Do side collisions
            let leftNextStep = Math.floor(x - Player_Width_Tiles/2 + 0.5 + speedX);
            let leftSideHit = this.isVerticalCollision(left, bottom, top);
            //Ignore the first step so it can climb stairs automatically (bottom + 1)
            let nextStepLeftSideHit = this.isVerticalCollision(leftNextStep, bottom + 1, top);
            if ((leftSideHit || nextStepLeftSideHit) && speedX < 0) {
                speedX = 0;
                if (leftSideHit) {
                    x = left + 1 + 0.5;
                } else {
                    x = leftNextStep + 1 + 0.5;
                }
            }
            //Check right side collisions
            let rightNextStep = Math.floor(x + Player_Width_Tiles/2 + 0.5 + speedX);
            let rightSideHit = this.isVerticalCollision(right, bottom, top);
            //Ignore the first step so it can climb stairs automatically (bottom + 1)
            let nextStepRightSideHit = this.isVerticalCollision(rightNextStep, bottom + 1, top);
            if ((rightSideHit || nextStepRightSideHit) && speedX > 0) {
                speedX = 0;
                if (rightSideHit) {
                    x = right - 1 - 0.5;
                } else {
                    x = rightNextStep - 1 - 0.5;
                }
            }
            //Add player speed to position
            x += speedX * delta;
            y += speedY * delta;
            playerGameData.setX(x);
            playerGameData.setY(y);
            playerGameData.setSpeedX(speedX);
            playerGameData.setSpeedY(speedY);
        });
    };

    getTilesInHorizontalCollision = (x1, x2, y) => {
        let tiles = [];
        for (let x = x1; x <= x2; x++) {
            let tile = this.board.getTile(x, y);
            if (tile !== null && tile.getTypeID() === Solid_Tile_Type) {
                tiles.push(tile);
            }
        }
        return tiles;
    };

    isHorizontalCollision = (x1, x2, y) => {
        for (let x = x1; x <= x2; x++) {
            let tile = this.board.getTile(x, y);
            if (tile !== null && tile.getTypeID() === Solid_Tile_Type) {
                return true;
            }
        }
        return false;
    };


    getTilesInVerticalCollision = (x, y1, y2) => {
        let tiles = [];
        for (let y = y1; y <= y2; y++) {
            let tile = this.board.getTile(x, y);
            if (tile !== null && tile.getTypeID() === Solid_Tile_Type) {
                tiles.push(tile);
            }
        }
        return tiles;
    };

    isVerticalCollision = (x, y1, y2) => {
        for (let y = y1; y <= y2; y++) {
            let tile = this.board.getTile(x, y);
            if (tile !== null && tile.getTypeID() === Solid_Tile_Type) {
                return true;
            }
        }
        return false;
    };

}