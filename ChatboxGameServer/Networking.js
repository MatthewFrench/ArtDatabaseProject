/*
 * Networking handles an array of connections
 * The minigames are suppose to handle how those connections interact with the game
 *
 */
global.Networking = function (port) {
        this.connections = new Array();
        this.port = port;
        
        var WebSocketServer = require('ws').Server;

        this.server = new WebSocketServer({port: port});
        
        var networking = this;
        // WebSocket server
        this.server.on('connection', function(ws) {
                var client = ws;
                var connection = networking.AddConnection(client);
                PlayerConnected(connection);
                client.on('message', function(message, flags) {
                        //try {
                                if (!flags.binary) {
                                        var object = JSON.parse(message);
                                        var title = object.title;
                                        var msg = object.msg;
                                        PlayerMessage(connection, title, msg);
                                } else {
                                        var buffer = new Buffer(message);
                                        PlayerBinaryMessage(connection, buffer);
                                }
                        //}catch (e){console.log("Message Error: "+e.message);}
                });
                
                client.on('close', function(client) {
                        // close user connection
                        networking.RemoveConnection(connection);
                        PlayerDisconnected(connection);
                });
        });
        
        this.AddConnection= function(client) {
                var p = new Connection(client);
                this.connections.push(p);
				p.connected = true;
                return p;
        }
        this.RemoveConnection = function(connection) {
				connection.connected = false;
                this.connections.splice(this.connections.indexOf(connection), 1);
        }
        
        this.GetConnection = function(client) {
                for (var i = 0; i < this.connections.length; i++) {
                        if (this.connections[i].client == client) {return this.connections[i];}
                }
                return null;
        }
        this.GetConnectionFromUID = function(uID) {
                for (var i = 0; i < connections.length; i++) {
                        if (this.connections[i].uID == uID) {return this.connections[i];}
                }
                return null;
        }
        this.SendToAll = function(title, object) {
                for (var i = 0 ; i < this.connections.length; i++) {
                        var c = this.connections[i];
                        c.Send(title, object);
                }
        }
        this.SendBinaryToAll = function(b) {
                for (var i = 0 ; i < this.connections.length; i++) {
                        var c = this.connections[i];
                        c.SendBinary(b);
                }
        }
}
global.uniqueID = 0;
global.Connection = function (client) {
    if (global.uniqueID >= 65534) {
	global.uniqueID = 0;
    }
    this.uID = global.uniqueID;
    global.uniqueID += 1;
    this.client = client;
    this.miniGame = null;
    this.name = "";
	this.connected = false;
    this.Send = function(title, object) {
        client.send(JSON.stringify({ title:title, msg: object }), {binary: false, mask: false, fin:true});
        }
        this.SendBinary = function(b) {
            client.send(b, {binary: true, mask: false, fin:true});
        }
}