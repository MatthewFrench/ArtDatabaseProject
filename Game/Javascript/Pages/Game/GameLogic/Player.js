const Frame_Next_Max = 4;
const Frame_Total_Max = 2;
const Idiot_Frame_Table = [1, 0, 2];

export class PlayerMovementInfo {
    constructor(x, y, speedX, speedY, movingLeft, movingRight, jumping) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.movingLeft = movingLeft;
        this.movingRight = movingRight;
        this.jumping = jumping;
    }

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

    updateSpriteFrame = () => {
        if (this.getServerMovingLeft() === true) {
            this.frameNextNumber += 1;
            if (this.frameNextNumber > Frame_Next_Max) {
                this.frameNextNumber = 0;
                this.frameNumber += 1;
                if (this.frameNumber > Frame_Total_Max) {
                    this.frameNumber = 0;
                }
                this.facingIndex = 9 + Idiot_Frame_Table[this.frameNumber];
            }
        }
        else if (this.getServerMovingRight() === true) {
            this.frameNextNumber += 1;
            if (this.frameNextNumber > Frame_Next_Max) {
                this.frameNextNumber = 0;
                this.frameNumber += 1;
                if (this.frameNumber > Frame_Total_Max) {
                    this.frameNumber = 0;
                }
                this.facingIndex = 3 + Idiot_Frame_Table[this.frameNumber];
            }
        }
        else if (this.getServerJumping() === true) {
            this.facingIndex = 8;
        }

        else{
            this.facingIndex = 7;
            this.frameNumber = 0;
            this.frameNextNumber = 0;
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