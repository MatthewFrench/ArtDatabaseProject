

export class Player {
    constructor(playerID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) {
        this.playerID = playerID;
        this.name = name;
        this.x = x;
        this.y = y;
        this.movingLeft = movingLeft;
        this.movingRight = movingRight;
        this.jumping = jumping;
        this.speedX = speedX;
        this.speedY = speedY;
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
    getName = () => {
        return this.name;
    }
}