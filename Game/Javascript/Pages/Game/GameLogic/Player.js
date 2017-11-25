

export class Player {
    constructor(playerID, name, x, y) {
        this.playerID = playerID;
        this.name = name;
        this.x = x;
        this.y = y;
        this.movingLeft = false;
        this.movingRight = false;
        this.jumping = false;
        this.speedX = 0;
        this.speedY = 0;
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