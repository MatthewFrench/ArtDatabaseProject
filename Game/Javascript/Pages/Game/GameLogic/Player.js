const Frame_Next_Max = 4;
const Frame_Total_Max = 2;
const Idiot_Frame_Table = [1, 0, 2];
const Minimum_Direction_Movement_Cutoff = 0.01;
const Player_Frame_Speed = 4;

const Facing_Left_Frame = 9;
const Facing_Right_Frame = 3;
const Facing_Forward_Frame = 7;
const Facing_Forward_Jumping_Frame = 8;

export class PlayerMovementInfo {
    constructor(x, y, speedX, speedY, movingLeft, movingRight, jumping) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.movingLeft = movingLeft;
        this.movingRight = movingRight;
        this.jumping = jumping;
        this.isOnGround = false;
    }

    getIsOnGround = () => {
        return this.isOnGround;
    };

    setIsOnGround = (isOnGround) => {
        this.isOnGround = isOnGround;
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
    getMovingLeft = () => {
        return this.movingLeft;
    };
    getMovingRight = () => {
        return this.movingRight
    };
    getJumping = () => {
        return this.jumping;
    };
    setMovingLeft = (movingLeft) => {
        this.movingLeft = movingLeft;
    };
    setMovingRight = (movingRight) => {
        this.movingRight = movingRight;
    };
    setJumping = (jumping) => {
        this.jumping = jumping;
    };
}

export class Player {
    constructor(playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) {
        this.playerID = playerID;
        this.name = name;

        this.clientMovementInfo = new PlayerMovementInfo(x, y, speedX, speedY, movingLeft, movingRight, jumping);
        this.serverMovementInfo = new PlayerMovementInfo(x, y, speedX, speedY, movingLeft, movingRight, jumping);

        this.spriteID = spriteID;

        this.frameNumber = 0;
        this.frameNextNumber = 0;
        this.facingIndex = 4;
    }

    incrementSpriteFrameNumber = (delta) => {
        this.frameNextNumber += Math.abs(this.getServerSpeedX()) * Player_Frame_Speed * delta;
        if (this.frameNextNumber > Frame_Next_Max) {
            this.frameNextNumber = 0;
            this.frameNumber += 1;
            if (this.frameNumber > Frame_Total_Max) {
                this.frameNumber = 0;
            }
        }
    };

    updateSpriteFrame = (delta) => {
        if (this.clientMovementInfo.getIsOnGround() === false) {
            //We're in the air
            if (this.getClientMovingRight() === true) {
                //Moving Right
                this.facingIndex = Facing_Right_Frame + Idiot_Frame_Table[this.frameNumber];
            } else if (this.getClientMovingLeft() === true) {
                //Moving Left
                this.facingIndex = Facing_Left_Frame + Idiot_Frame_Table[this.frameNumber];
            } else {
                if (this.getClientJumping()) {
                    //Trying to jump
                    this.facingIndex = Facing_Forward_Jumping_Frame;
                } else {
                    //Falling
                    this.facingIndex = Facing_Forward_Frame;
                    this.frameNumber = 0;
                    this.frameNextNumber = 0;
                }
            }
        } else {
            //On the ground
            if (this.getClientMovingLeft()) {
                //Moving left
                this.incrementSpriteFrameNumber(delta);
                this.facingIndex = Facing_Left_Frame + Idiot_Frame_Table[this.frameNumber];
            } else if (this.getClientMovingRight()) {
                //Moving right
                this.incrementSpriteFrameNumber(delta);
                this.facingIndex = Facing_Right_Frame + Idiot_Frame_Table[this.frameNumber];
            } else {
                //Not trying to move left or right but on ground
                if (this.getClientSpeedX() < -Minimum_Direction_Movement_Cutoff) {
                    //Face direction we're gliding, left
                    this.incrementSpriteFrameNumber(delta);
                    this.facingIndex = Facing_Left_Frame + Idiot_Frame_Table[this.frameNumber];
                } else if (this.getClientSpeedX() > Minimum_Direction_Movement_Cutoff) {
                    //Face direction we're gliding, right
                    this.incrementSpriteFrameNumber(delta);
                    this.facingIndex = Facing_Right_Frame + Idiot_Frame_Table[this.frameNumber];
                } else {
                    //Face center
                    this.facingIndex = Facing_Forward_Frame;
                    this.frameNumber = 0;
                    this.frameNextNumber = 0;
                }
            }
        }
    };

    getSpriteFrame = () => {
        return this.facingIndex;
    };
    setSpriteID = (spriteID) => {
        this.spriteID = spriteID;
    };
    getClientX = () => {
        return this.clientMovementInfo.x;
    };
    setClientX = (x) => {
        this.clientMovementInfo.x = x;
    };
    getClientY = () => {
        return this.clientMovementInfo.y;
    };
    setClientY = (y) => {
        this.clientMovementInfo.y = y;
    };
    getClientSpeedX = () => {
        return this.clientMovementInfo.speedX;
    };
    getClientSpeedY = () => {
        return this.clientMovementInfo.speedY;
    };
    setClientSpeedX = (x) => {
        this.clientMovementInfo.speedX = x;
    };
    setClientSpeedY = (y) => {
        this.clientMovementInfo.speedY = y;
    };
    getClientMovingLeft = () => {
        return this.clientMovementInfo.movingLeft;
    };
    getClientMovingRight = () => {
        return this.clientMovementInfo.movingRight
    };
    getClientJumping = () => {
        return this.clientMovementInfo.jumping;
    };
    getClientMovementInfo = () => {
        return this.clientMovementInfo;
    };

    getServerX = () => {
        return this.serverMovementInfo.x;
    };
    setServerX = (x) => {
        this.serverMovementInfo.x = x;
    };
    getServerY = () => {
        return this.serverMovementInfo.y;
    };
    setServerY = (y) => {
        this.serverMovementInfo.y = y;
    };
    getServerSpeedX = () => {
        return this.serverMovementInfo.speedX;
    };
    getServerSpeedY = () => {
        return this.serverMovementInfo.speedY;
    };
    setServerSpeedX = (x) => {
        this.serverMovementInfo.speedX = x;
    };
    setServerSpeedY = (y) => {
        this.serverMovementInfo.speedY = y;
    };
    getServerMovingLeft = () => {
        return this.serverMovementInfo.movingLeft;
    };
    getServerMovingRight = () => {
        return this.serverMovementInfo.movingRight
    };
    getServerJumping = () => {
        return this.serverMovementInfo.jumping;
    };
    getServerMovementInfo = () => {
        return this.serverMovementInfo;
    };
    getName = () => {
        return this.name;
    };
    getSpriteID = () => {
        return this.spriteID;
    };
}