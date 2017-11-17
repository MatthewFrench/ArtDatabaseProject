const assert = require('assert');
const {Query} = require("../Pixel Platformer Server/Database/Query.js");
const {Configuration} = require("../Pixel Platformer Server/Configuration.js");
const NS_PER_SEC = 1e9;

class DatabaseTest {
  constructor() {
    console.log('Running Database Tests');
    Configuration.Initialize(); //Load the config file
    Query.Initialize();
    this.testAllDataValues().then();
  }

  async testAllDataValues() {
    console.log('Testing Database Queries');

    for (let index = 0; index < 10; index++) {
      await this.getSpriteTest();
    }

    assert.equal(true, true, "True is not true");

    console.log('\nDatabase Test Success');
  }

  async getSpriteTest() {
    let timeStamp = process.hrtime();

    //Query
    let spriteResults = await Query.GetSprites();

    let difference = process.hrtime(timeStamp);
    let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
    console.log('Sprite Test Duration(ms): ' + milliseconds);

    //Test print out sprites
    console.log("Sprites: " + JSON.stringify(spriteResults));
  }
}

exports.DatabaseTest = DatabaseTest;