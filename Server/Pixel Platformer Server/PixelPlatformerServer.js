const {Query} = require("./Database/Query.js");
const {Configuration} = require("./Configuration.js");

class PixelPlatformerServer {
  constructor() {
    Configuration.Initialize(); //Load the config file
    Query.Initialize(() => {
      //Connected to the DB
    });
  }
}

exports.PixelPlatformerServer = PixelPlatformerServer;