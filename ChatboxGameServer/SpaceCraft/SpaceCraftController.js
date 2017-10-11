module.exports.SpaceCraft = function() {
    this.players = [];
    this.ships = [];

    this.GameLogic = function(delta) {
    }
    this.AddPlayer = function(connection) {
        console.log("Added " + connection.name + " to spacecraft.");
        connection.Send("MiniGame",{game: "SpaceCraft"});
        this.players.push(connection);
    }
    this.RemovePlayer = function(connection) {
	this.players.splice(this.players.indexOf(connection), 1);
    }
    this.Message = function(connection, title, message) {
    }
    this.BinaryMessage = function(connection, buffer) {
    }
}