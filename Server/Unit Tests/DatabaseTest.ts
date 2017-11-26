const assert = require('assert');
import {Query} from "../Pixel Platformer Server/Database/Query";
import {Configuration} from "../Pixel Platformer Server/Configuration";

const NS_PER_SEC = 1e9;

export class DatabaseTest {
    constructor() {
        console.log('Running Database Tests');
        Configuration.Initialize(); //Load the config file
        Query.Initialize();
        this.testAllDataValues().then();
    }

    async testAllDataValues() {
        console.log('Testing Database Queries');

        await this.getSpriteTest();

        await this.getAllTilesTest();

        await this.getBoardInfoTest();

        await this.insertTileTest();

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

    async getAllTilesTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.GetAllTiles(1);

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Tiles Test Duration(ms): ' + milliseconds);

        //Test print out sprites
        console.log("Tiles: " + JSON.stringify(results));
    }

    async insertTileTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.UpdateOrInsertTile(0, 0, 0, 0,
            0, 0, 0, 0, 3);

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Insert Tile Test Duration(ms): ' + milliseconds);

        //Test print out sprites
        console.log("Insert Tile: " + JSON.stringify(results));
    }

    async getBoardInfoTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.GetBoardByID(1);

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Tiles Test Duration(ms): ' + milliseconds);

        //Test print out sprites
        console.log("Board: " + JSON.stringify(results));
    }
}