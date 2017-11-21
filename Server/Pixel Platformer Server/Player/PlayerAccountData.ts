

export class PlayerAccountData {
    private loggedIn = false;
    private playerID = -1;
    private username = '';
    private displayName = '';
    private email = '';
    private spriteID = -1;

    constructor() {

    }
    isLoggedIn = () => {
        return this.loggedIn;
    };
    setIsLoggedIn = (loggedIn) => {
        this.loggedIn = loggedIn;
    };
    getUsername = () => {
        return this.username;
    };
    setUsername = (username) => {
        this.username = username;
    };
    getDisplayName = () => {
        return this.displayName;
    };
    setDisplayName = (displayName) => {
        this.displayName = displayName;
    };
    getEmail = () => {
        return this.email;
    };
    setEmail = (email) => {
        this.email = email;
    };
    getSpriteID = () => {
        return this.spriteID;
    };
    setSpriteID = (spriteID) => {
        this.spriteID = spriteID;
    };
    getPlayerID = () => {
        return this.playerID;
    };
    setPlayerID = (playerID) => {
        this.playerID = playerID;
    };
}