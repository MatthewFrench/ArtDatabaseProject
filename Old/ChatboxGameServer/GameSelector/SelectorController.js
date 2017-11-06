module.exports.Selector = function() {
    this.players = [];

    this.GameLogic = function(delta) {
    }
    this.AddPlayer = function(connection) {
        console.log("Added " + connection.name + " to selection screen.");
        connection.Send("MiniGame",{game: "Selector"});
        this.players.push(connection);
    }
    this.RemovePlayer = function(connection) {
	this.players.splice(this.players.indexOf(connection), 1);
    }
    this.Message = function(connection, title, message) {
	if (title == "Game") {
	    global.StartMiniGame(connection, message);
	}
    }
    this.BinaryMessage = function(connection, buffer) {
    }
}