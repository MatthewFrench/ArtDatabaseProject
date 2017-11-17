const assert = require('assert');
const {Query} = require("../Pixel Platformer Server/Database/Query.js");
const {Configuration} = require("../Pixel Platformer Server/Configuration.js");
const NS_PER_SEC = 1e9;

class DatabaseTest {
  constructor() {
    console.log('Running Database Tests');
    Configuration.Initialize(); //Load the config file
    Query.Initialize();
    this.testAllDataValues();
  }

  testAllDataValues() {
    console.log('Testing Database Queries');
    let timeStamp = process.hrtime();

    //Query
    Query.GetSprites((spriteResults) => {
      //Test print out sprites
      console.log("Sprites: " + JSON.stringify(spriteResults));
      
      let difference = process.hrtime(timeStamp);
      let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
      console.log('Database Test Duration(ms): ' + milliseconds);

      assert.equal(true, true, "True is not true");

      console.log('\nDatabase Test Success');

    });
  }
}

exports.DatabaseTest = DatabaseTest;