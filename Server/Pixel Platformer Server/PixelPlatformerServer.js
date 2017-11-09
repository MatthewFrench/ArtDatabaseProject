const {Query} = require("./Database/Query.js");

class PixelPlatformerServer {
  constructor() {
    console.log('Hello World');

    Query.Initialize(); //Connect the DB
    Query.GetUserInformationWithLoginInfo();
  }
}

exports.PixelPlatformerServer = PixelPlatformerServer;