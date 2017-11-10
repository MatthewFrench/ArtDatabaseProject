const {Query} = require("./Database/Query.js");
const {Configuration} = require("./Configuration.js");
const {Network} = require("./Networking/Network.js");

class PixelPlatformerServer {
  constructor() {
    Configuration.Initialize(); //Load the config file
    Query.Initialize(() => {
      //Connected to the DB
      Network.Initialize();
    });
  }
}

exports.PixelPlatformerServer = PixelPlatformerServer;