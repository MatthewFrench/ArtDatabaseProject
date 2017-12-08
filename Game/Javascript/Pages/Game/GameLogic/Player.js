const Frame_Next_Max = 4;
const Frame_Total_Max = 2;
const Idiot_Frame_Table = [1, 0, 2];

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

        this.frameNumber = 0;
        this.frameNextNumber = 0;
        this.facingIndex = 4;
    }

    updateSpriteFrame = () => {
        if (this.movingLeft === true) {
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
        else if (this.movingRight === true) {
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
        else if (this.jumping === true) {
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