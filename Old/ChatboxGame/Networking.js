this.Networking = function() {
   // if user is running mozilla then use it's built-in WebSocket
   window.WebSocket = window.WebSocket || window.MozWebSocket;
   
   //this.connection = new WebSocket('ws://174.70.162.6:7778');
   this.connection = new WebSocket('ws://127.0.0.1:7778');
   this.connection.binaryType = "arraybuffer";
   
   var n = this;
   this.connection.onopen = function () {
      // connection is opened and ready to use
      addChat("Connected as " + name);
      n.Send("Name", {name: name});
   };
   
   this.connection.onerror = function (error) {
       // an error occurred when sending/receiving data
       addChat("Connection Error");
   };
   
   this.connection.onclose = function (error) {
       currentMiniGame = null;
       addChat("Disconnected");
       setOnline("");
   };
   
   this.connection.onmessage = function (message) {
      if (typeof message.data === "string") {
         //try {
            var json = JSON.parse(message.data);
            var title = json.title;
            var msg = json.msg;
            Message(title, msg);
         //} catch (e) {
         //}
      } else if (message.data instanceof ArrayBuffer) {
         //Array buffer
         var x = new DataView(message.data);
         BinaryMessage(x);
     }
   }
   
   this.Send = function(title, msg) {
      this.connection.send(JSON.stringify({ title:title, msg: msg }));
   }
   this.SendBinary = function(msg) {
      this.connection.send(msg);
   }
}