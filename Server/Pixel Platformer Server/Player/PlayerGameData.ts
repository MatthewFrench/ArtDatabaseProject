

export class PlayerGameData {
    private currentBoardID = -1;
    private locationX = 0;
    private locationY = 0;
    private speedX = 0;
    private speedY = 0;
    private movingLeft = false;
    private movingRight = false;
    private jumping = false;
    constructor() {

    }
    getCurrentBoardID = () => {
        return this.currentBoardID;
    };
    setCurrentBoardID = (boardID) => {
        this.currentBoardID = boardID;
    };
    getX = () => {
        return this.locationX;
    };
    getY = () => {
        return this.locationY;
    };
    getSpeedX = () => {
        return this.speedX;
    };
    getSpeedY = () => {
        return this.speedY;
    };
    getMovingLeft = () => {
        return this.movingLeft;
    };
    getMovingRight = () => {
        return this.movingRight;
    };
    getJumping = () => {
        return this.jumping;
    };

    setX = (x) => {
        this.locationX = x;
    };
    setY = (y) => {
        this.locationY = y;
    };
    setSpeedX = (x) => {
        this.speedX = x;
    };
    setSpeedY = (y) => {
        this.speedY = y;
    };
    setMovingLeft = (value) => {
        this.movingLeft = value;
    };
    setMovingRight = (value) => {
        this.movingRight = value;
    };
    setJumping = (value) => {
        this.jumping = value;
    };
}