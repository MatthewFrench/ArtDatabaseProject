

export class Player {
    constructor(playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) {
        this.playerID = playerID;
        this.name = name;
        this.x = x;
        this.y = y;
        this.movingLeft = movingLeft;
        this.movingRight = movingRight;
        this.jumping = jumping;
        this.speedX = speedX;
        this.speedY = speedY;
        this.spriteID = spriteID;
    }
    updateSpriteFrame = () => {
        /*
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (focusPlayer !== null) {
            if (this.leftPressed) {
                focusPlayer.movingLeft = true;
                this.frameNextNumber += 1;
                if(this.frameNextNumber > Frame_Next_Max){
                    this.frameNextNumber = 0;
                    this.frameNumber += 1;
                    if(this.frameNumber > Frame_Total_Max){
                        this.frameNumber = 0;
                    }
                    this.facingIndex = 9 + Idiot_Frame_Table[this.frameNumber];
                }
            } else {
                focusPlayer.movingLeft = false;
            }
            if (this.rightPressed) {
                focusPlayer.movingRight = true;
                this.frameNextNumber += 1;
                if(this.frameNextNumber > Frame_Next_Max){
                    this.frameNextNumber = 0;
                    this.frameNumber += 1;
                    if(this.frameNumber > Frame_Total_Max){
                        this.frameNumber = 0;
                    }
                    this.facingIndex = 3 + Idiot_Frame_Table[this.frameNumber];
                }
                //console.log(this.frameNumber, this.frameNextNumber);
                //this.physicsLogic.applyForceToPlayer(focusPlayer, 10, 0);
                //focusPlayer.setX(focusPlayer.getX() + 0.1);
            } else {
                focusPlayer.movingRight = false;
            }
            if (this.upPressed) {
                focusPlayer.jumping = true;
                this.facingIndex = 8;
                //this.physicsLogic.applyForceToPlayer(focusPlayer, 0, 10);
                //focusPlayer.setY(focusPlayer.getY() + 0.1);
            } else {
                focusPlayer.jumping = false;
            }
            if (this.downPressed) {
                //this.physicsLogic.applyForceToPlayer(focusPlayer, 0, 1);
                //focusPlayer.setY(focusPlayer.getY() - 0.1);
            }
        }*/
    };
    getSpriteFrame = () => {
        let facing = 0;
        if(this.movingLeft){
            facing = 9;
        }
        else if(this.movingRight){
            facing = 5;
        }
        else if(this.jumping){
            facing = 8;
        }
        else{
            facing = 7;
        }
        return facing;
    };
    getX = () => {
        return this.x;
    };
    setX = (x) => {
        this.x = x;
    };
    getY = () => {
        return this.y;
    };
    setY = (y) => {
        this.y = y;
    };
    getSpeedX = () => {
        return this.speedX;
    };
    getSpeedY = () => {
        return this.speedY;
    };
    setSpeedX = (x) => {
        this.speedX = x;
    };
    setSpeedY = (y) => {
        this.speedY = y;
    };
    getName = () => {
        return this.name;
    };
    getSpriteID = () => {
        return this.spriteID;
    };
    getMovingLeft = () => {
        return this.movingLeft;
    };
    getMovingRight = () => {
        return this.movingRight
    };
    getJumping = () => {
        return this.jumping;
    };
}