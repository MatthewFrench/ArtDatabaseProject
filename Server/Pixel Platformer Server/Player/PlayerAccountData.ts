

export class PlayerAccountData {
    loggedIn = false;
    playerID = -1;
    username = '';
    displayName = '';
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
}