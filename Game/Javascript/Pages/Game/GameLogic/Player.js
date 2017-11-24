

export class Player {
    constructor(playerID, name, x, y) {
        this.playerID = playerID;
        this.name = name;
        this.x = x;
        this.y = y;
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