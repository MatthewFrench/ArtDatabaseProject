import {Stopwatch} from "../../../Utility/Stopwatch";

const Player_Width_Tiles = 2;
//Player height is 5 but subtract a tiny bit to allow physics to pass it underneath tight spaces.
const Player_Height_Tiles = 5;
const Gravity = 0.02;
const Player_Move_Speed = 0.01;
const Player_Jump_Speed = 0.8;
const Ground_Friction = 0.98;
const Cut_Off = 0.0001;

const Solid_Tile_Type = 4;
const Tunnel_Speed_Cap = 0.5;

const Minimum_Rubber_Band_Tolerance = 0.01;
const Frame_Rubber_Band_Percentage = 1.0/60.0/5; //Move 16% per frame, full rubber band in 5 seconds

const Linear_Interpolation_Duration = 0.20;

export class PhysicsLogic {
    constructor() {
        this.board = null;
    }
    logic = (board, delta) => {
        this.board = board;
        //this.unhighlightAllTiles();
        while (delta > 1.0) {
            this.runPhysics(board, 1.0);
            delta -= 1.0;
        }
        this.runPhysics(board, delta);
    };

    runPhysics = (board, physicsDelta) => {
        let players = board.getPlayers();
        //Loop through all players
        players.forEach((player)=>{
            let totalDelta = 0;
            while (totalDelta < physicsDelta) {
                let deltaLeft = physicsDelta - totalDelta;
                let speedX = player.getServerMovementInfo().getSpeedX();
                let speedY = player.getServerMovementInfo().getSpeedY();
                let playerSpeed = Math.hypot(speedX, speedY);
                if (playerSpeed * deltaLeft > Tunnel_Speed_Cap) {
                    let maxAllowedDelta = Tunnel_Speed_Cap / playerSpeed;
                    //Calculate the maximum safe delta for anti-tunnelling
                    this.runPlayerPhysicsLogic(player, maxAllowedDelta);
                    totalDelta += maxAllowedDelta;
                } else {
                    this.runPlayerPhysicsLogic(player, deltaLeft);
                    totalDelta += deltaLeft;
                }
            }
        });
    };

    /**
     * Run physics on client and server movement information. Then interpolate between.
     */
    runPlayerPhysicsLogic = (player, delta)=> {
        let clientInfo = player.getClientMovementInfo();
        let serverInfo = player.getServerMovementInfo();
        this.runPhysicsOnPlayerMovement(clientInfo, delta);
        this.runPhysicsOnPlayerMovement(serverInfo, delta);

        let interpolationSmoothingSeconds = Linear_Interpolation_Duration; //1 second
        if (clientInfo.interpolationRunning === false) {
            clientInfo.setX(serverInfo.getX());
            clientInfo.setY(serverInfo.getY());
            clientInfo.setSpeedX(serverInfo.getSpeedX());
            clientInfo.setSpeedY(serverInfo.getSpeedY());
        } else {
            let donePercent = clientInfo.interpolationStopwatch.getMilliseconds() / (interpolationSmoothingSeconds * 1000.0);
            if (donePercent >= 1.0) {
                clientInfo.setX(serverInfo.getX());
                clientInfo.setY(serverInfo.getY());
                clientInfo.setSpeedX(serverInfo.getSpeedX());
                clientInfo.setSpeedY(serverInfo.getSpeedY());
                clientInfo.interpolationRunning = false;
            } else {
                clientInfo.setX(this.percentInterpolate(clientInfo.getX(), serverInfo.getX(),
                    clientInfo.interpolationDistanceX, interpolationSmoothingSeconds, donePercent, delta));
                clientInfo.setY(this.percentInterpolate(clientInfo.getY(), serverInfo.getY(),
                    clientInfo.interpolationDistanceY, interpolationSmoothingSeconds, donePercent, delta));
                clientInfo.setSpeedX(this.percentInterpolate(clientInfo.getSpeedX(), serverInfo.getSpeedX(),
                    clientInfo.interpolationSpeedX, interpolationSmoothingSeconds, donePercent, delta));
                clientInfo.setSpeedY(this.percentInterpolate(clientInfo.getSpeedY(), serverInfo.getSpeedY(),
                    clientInfo.interpolationSpeedY, interpolationSmoothingSeconds, donePercent, delta));

            }
        }

        //*******Interpolate client closer to server
        clientInfo.setX(this.getRubberBandInterpolatedValue(serverInfo.getX(), clientInfo.getX()));
        clientInfo.setY(this.getRubberBandInterpolatedValue(serverInfo.getY(), clientInfo.getY()));
        clientInfo.setSpeedX(this.getRubberBandInterpolatedValue(serverInfo.getSpeedX(), clientInfo.getSpeedX()));
        clientInfo.setSpeedY(this.getRubberBandInterpolatedValue(serverInfo.getSpeedY(), clientInfo.getSpeedY()));
    };

    percentInterpolate = (clientValue, serverValue, interpolationDistance, interpolationSmoothingSeconds, donePercent, delta) => {
        let moveAmount = 0.034 / interpolationSmoothingSeconds * delta;
        let distanceBetween = Math.abs(clientValue - serverValue);
        if (distanceBetween < moveAmount) {
            clientValue = serverValue;
        } else {
            if (clientValue < serverValue) {
                clientValue = clientValue + moveAmount;
            } else {
                clientValue = clientValue - moveAmount;
            }
            //Move client closer if it's past max distance
            let maxDistanceFromServer = Math.abs(interpolationDistance * (1.0 - donePercent));
            let currentDistance = Math.abs(clientValue - serverValue);
            if (currentDistance > maxDistanceFromServer) {
                if (clientValue < serverValue) {
                    clientValue = serverValue - maxDistanceFromServer;
                } else {
                    clientValue = serverValue + maxDistanceFromServer;
                }
            }
        }
        return clientValue;
    };

    getRubberBandInterpolatedValue = (serverValue, clientValue) => {
        let xDistance = Math.abs(clientValue - serverValue);
        if (xDistance < Minimum_Rubber_Band_Tolerance) {
            clientValue = serverValue;
        } else {
            //Probably could be better written for rubber banding
            let percentage = 1.0 - (Minimum_Rubber_Band_Tolerance / xDistance);
            let scalePercentage = Frame_Rubber_Band_Percentage * (10 * percentage);
            let travelDistance = xDistance * scalePercentage;
            travelDistance = Math.max(Minimum_Rubber_Band_Tolerance, travelDistance);
            if (serverValue < clientValue) {
                clientValue -= travelDistance;
            } else {
                clientValue += travelDistance;
            }
        }
        return clientValue;
    };

    runPhysicsOnPlayerMovement = (playerMovementInfo, delta) => {
        let speedX = playerMovementInfo.getSpeedX();
        let speedY = playerMovementInfo.getSpeedY();
        let x = playerMovementInfo.getX();
        let y = playerMovementInfo.getY();
        let movingLeft = playerMovementInfo.getMovingLeft();
        let movingRight = playerMovementInfo.getMovingRight();
        let jumping = playerMovementInfo.getJumping();

        //Add gravity and friction
        speedY -= Gravity * delta;

        //Cut off horizontal speed after a point
        if (Math.abs(speedX) <= Cut_Off) {
            speedX = 0;
        }

        //Check for collision
        let left = Math.floor(x - Player_Width_Tiles/2 + 0.5);
        let right = Math.ceil(x + Player_Width_Tiles/2 - 0.5);
        let bottom = Math.floor(y);
        let top = Math.ceil(y + Player_Height_Tiles);

        let onGround = this.isHorizontalCollision(left, right, bottom);
        let bottomNextStep = Math.floor( y + speedY * delta);
        let nextStepOnGround = this.isHorizontalCollision(left, right, bottomNextStep);

        //Check if on ground
        if ((onGround || nextStepOnGround) && speedY < 0) {
            speedY = 0;
            //Set the tile to be above the ground tile
            if (onGround) {
                y = bottom + 1;
                //this.highlightTiles(this.getTilesInHorizontalCollision(left, right, bottom));
            } else {
                y = bottomNextStep + 1;
                //this.highlightTiles(this.getTilesInHorizontalCollision(left, right, bottomNextStep));
            }
            bottom = Math.floor(y);
            top = Math.ceil(y + Player_Height_Tiles);
            playerMovementInfo.setIsOnGround(true);
        } else {
            playerMovementInfo.setIsOnGround(false);
        }
        onGround = onGround || nextStepOnGround;


        //Apply ground friction
        if (onGround) {
            speedX *= Math.pow(Ground_Friction, delta);
        }

        //Apply movement
        if (movingLeft) {
            //Apply a massive slowdown to allow easy mid-air moving
            if (speedX > 0) {
                speedX *= Math.pow(0.9, delta);
            }
            speedX -= Player_Move_Speed * delta;
        }
        if (movingRight) {
            //Apply a massive slowdown to allow easy mid-air moving
            if (speedX < 0) {
                speedX *= Math.pow(0.9, delta);
            }
            speedX += Player_Move_Speed * delta;
        }
        if (jumping && onGround && speedY < Player_Jump_Speed) {
            //This is an impulse, instant. Delta does not get applied.
            speedY += Player_Jump_Speed;
        }

        //Check to see if we're hitting a tile from above
        let topNextStep = Math.floor(y + Player_Height_Tiles + speedY * delta);
        let topSideHit = this.isHorizontalCollision(left, right, top);
        let nextStepTopSideHit = this.isHorizontalCollision(left, right, topNextStep);
        if ((topSideHit || nextStepTopSideHit) && speedY > 0) {
            speedY = 0;

            if (topSideHit) {
                y = top - Player_Height_Tiles;
                //this.highlightTiles(this.getTilesInHorizontalCollision(left, right, top));
            } else {
                y = topNextStep - Player_Height_Tiles;
                //this.highlightTiles(this.getTilesInHorizontalCollision(left, right, topNextStep));
            }

            bottom = Math.floor(y);
            top = Math.ceil(y + Player_Height_Tiles);
        }

        //Do side collisions
        let leftNextStep = Math.floor(x - Player_Width_Tiles/2 + 0.5 + speedX * delta);
        let leftSideHit = this.isVerticalCollision(left, bottom, top - 1);
        //Ignore the first step so it can climb stairs automatically (bottom + 1)
        let nextStepLeftSideHit = this.isVerticalCollision(leftNextStep, bottom + 1, top - 1);
        if ((leftSideHit || nextStepLeftSideHit) && speedX < 0) {
            speedX = 0;
            if (leftSideHit) {
                x = left + 1 + 0.5;
                //this.highlightTiles(this.getTilesInVerticalCollision(left, bottom, top - 1));
            } else {
                x = leftNextStep + 1 + 0.5;
                //this.highlightTiles(this.getTilesInVerticalCollision(leftNextStep, bottom, top - 1));
            }
        }
        //Check right side collisions
        let rightNextStep = Math.floor(x + Player_Width_Tiles/2 + 0.5 + speedX * delta);
        let rightSideHit = this.isVerticalCollision(right, bottom, top - 1);
        //Ignore the first step so it can climb stairs automatically (bottom + 1)
        let nextStepRightSideHit = this.isVerticalCollision(rightNextStep, bottom + 1, top - 1);
        if ((rightSideHit || nextStepRightSideHit) && speedX > 0) {
            speedX = 0;
            if (rightSideHit) {
                x = right - 1 - 0.5;
                //this.highlightTiles(this.getTilesInVerticalCollision(right, bottom, top - 1));
            } else {
                x = rightNextStep - 1 - 0.5;
                //this.highlightTiles(this.getTilesInVerticalCollision(rightNextStep, bottom, top - 1));
            }
        }
        //Add player speed to position
        x += speedX * delta;
        y += speedY * delta;
        playerMovementInfo.setX(x);
        playerMovementInfo.setY(y);
        playerMovementInfo.setSpeedX(speedX);
        playerMovementInfo.setSpeedY(speedY);
    };

   // unhighlightAllTiles = () => {
        /*
        this.board.tiles.forEach((x) => {
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
        */
    //};
/*
    highlightTiles = (tiles) => {
        for (let tile of tiles) {
            if (!tile.highlighted) {
                tile.highlighted = true;
                tile.originalR = tile.r;
                tile.originalG = tile.g;
                tile.originalB = tile.b;
                tile.originalA = tile.a;
                tile.r = 255;
                tile.g = 0;
                tile.b = 0;
                tile.a = 255;
            }
        }
    };
    */

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