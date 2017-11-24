//Holds information for a tile.
export class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
    }
    setColor = (r, g, b, a) => {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };
    getX = () => {
        return this.x;
    };
    getY = () => {
        return this.y;
    };
    getR = () => {
        return this.r;
    };
    getG = () => {
        return this.g;
    };
    getB = () => {
        return this.b;
    };
    getA = () => {
        return this.a;
    };
}