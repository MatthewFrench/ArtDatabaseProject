import {Board} from "../Pixel Platformer Server/Logic/Game/Board";

const assert = require('assert');
import {Query} from "../Pixel Platformer Server/Database/Query";
import {Configuration} from "../Pixel Platformer Server/Configuration";

const NS_PER_SEC = 1e9;

export class DatabaseTest {
    constructor() {
        console.log('Running Database Tests');
        Configuration.Initialize(); //Load the config file
        Query.Initialize();
        //this.createBoard();
        //this.getAllTilesTest();
        //this.getBoardInfoTest(); //passes
        //this.getSpriteTest(); //passes
        //this.insertTileTest(); //passes
        //this.testAllDataValues().then();
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

    async createBoard(){

        var info = await Query.CreateBoard("hello", "hahahahahaahaahhaahaeiordwfjakf");

        assert.equal(info, 42, "Did not pass");

    }


    async getSpriteTest() {
        let timeStamp = process.hrtime();

        //Query
        let spriteResults = await Query.GetSprites();

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Sprite Test Duration(ms): ' + milliseconds);

        var correct = JSON.stringify([{"sprite_id":1,"image_url":"M_TOPHAT_BROWN"},{"sprite_id":2,"image_url":"M_TOPHAT_BLACK"},{"sprite_id":3,"image_url":"M_NEWSBOY"},{"sprite_id":4,"image_url":"M_DOCTOR_MASK"},{"sprite_id":5,"image_url":"M_DOCTOR_NOMASK"},{"sprite_id":6,"image_url":"F_NURSE"},{"sprite_id":7,"image_url":"M_DOCTOR_BLOODY"},{"sprite_id":8,"image_url":"M_TOPHAT_GLASSES"}]);


        assert.equal(JSON.stringify(spriteResults),correct, "Sprites didn't equal")
        console.log("getSpriteTest Passed")

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
        let results = await Query.UpdateOrInsertTile(1, 0, 0, 0,
            0, 0, 0, 0, 3);

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Insert Tile Test Duration(ms): ' + milliseconds);


        assert.equal(results,74, "Tile is expected to be 74")
        console.log("insertTileTest Passed")
    }

    async getBoardInfoTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.GetBoardByID(1);

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Tiles Test Duration(ms): ' + milliseconds);


        var info = results;

        assert.equal(info.board_id, 1, "Board ID is wrong")
        assert.equal(info.name, "Home", "Board Name is wrong")
        assert.equal(info.creator_id, 5, "Creator ID is wrong")
        assert.equal(info.is_deleted, 0, "Board is not deleted")
        assert.equal(info.max_width,-1,"Max width should be -1")
        assert.equal(info.max_height, -1, "Max height should be -1")
        console.log("getBoardInfoTest Passed");

    }
}
