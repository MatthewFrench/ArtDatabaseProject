

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