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
        //this.createBoardTest(); //passes
        this.userLoginTest(); //passes
        this.getAllTilesTest(); //passes
        this.getBoardInfoTest(); //passes
        this.getSpriteTest(); //passes
        this.insertTileTest(); //passes
        this.changeBoardNameTest(); //passes
        this.getPlayerSpriteTest(); //passes
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

    async getPlayerSpriteTest(){
        var info = await Query.GetPlayerSprite(117);
        assert.equal(info[0]['sprite_id'], 1, "Wrong sprite selected");
        console.log("getPlayerSpriteTest passed")
    }

    async changeBoardNameTest(){
        await Query.ChangeBoardName(58, "New Name");
        let results = await Query.GetBoardByID(58);
        assert.equal(results.name, "New Name", "Board Name is wrong");
        console.log("changeBoardNameTest passed")
    }

    async createBoardTest(){

        var info = await Query.CreateBoard("hello", "hahahahahaahaahhaahaeiordwfjakf");
        console.log(info);
        assert.ok(Number.isInteger(info), "Did not pass");
        console.log("createBoardTest passed")

    }

    async userLoginTest(){
        var response = await Query.UserLogin('username','password');


        assert.equal(response['player_id'],117,"Player id is wrong");
        assert.equal(response['display_name'], 'username', "Username is wrong");
        assert.equal(response['email'], 'na@na.com', "User email is wrong");
        console.log("userLoginTest Passes")
    }

    async getSpriteTest() {
        //let timeStamp = process.hrtime();

        //Query
        let spriteResults = await Query.GetSprites();

        //let difference = process.hrtime(timeStamp);
        //let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        //console.log('Sprite Test Duration(ms): ' + milliseconds);

        var correct = JSON.stringify([{"sprite_id":1,"image_url":"M_TOPHAT_BROWN"},{"sprite_id":2,"image_url":"M_TOPHAT_BLACK"},{"sprite_id":3,"image_url":"M_NEWSBOY"},{"sprite_id":4,"image_url":"M_DOCTOR_MASK"},{"sprite_id":5,"image_url":"M_DOCTOR_NOMASK"},{"sprite_id":6,"image_url":"F_NURSE"},{"sprite_id":7,"image_url":"M_DOCTOR_BLOODY"},{"sprite_id":8,"image_url":"M_TOPHAT_GLASSES"}]);


        assert.equal(JSON.stringify(spriteResults),correct, "Sprites didn't equal")
        console.log("getSpriteTest Passed")

    }

    async getAllTilesTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.GetAllTiles(1);

        //let difference = process.hrtime(timeStamp);
        //let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        //console.log('Tiles Test Duration(ms): ' + milliseconds);

        //Test print out sprites
        //console.log("Tiles: " + JSON.stringify(results));
        assert.ok(JSON.stringify(results), "Did not receive tiles");
        console.log("getAllTilesTest passed");
    }

    async insertTileTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.UpdateOrInsertTile(1, 0, 0, 0,
            0, 0, 0, 0, 3);

        //let difference = process.hrtime(timeStamp);
        //let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        //console.log('Insert Tile Test Duration(ms): ' + milliseconds);


        assert.equal(results,74, "Tile is expected to be 74")
        console.log("insertTileTest Passed")
    }

    async getBoardInfoTest() {
        let timeStamp = process.hrtime();

        //Query
        let results = await Query.GetBoardByID(1);

        //let difference = process.hrtime(timeStamp);
        //let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        //console.log('Tiles Test Duration(ms): ' + milliseconds);


        //console.log(results)

        assert.equal(results.board_id, 1, "Board ID is wrong")
        assert.equal(results.name, "Home", "Board Name is wrong")
        assert.equal(results.creator_id, 5, "Creator ID is wrong")
        assert.equal(results.is_deleted, 0, "Board is not deleted")
        assert.equal(results.max_width,-1,"Max width should be -1")
        assert.equal(results.max_height, -1, "Max height should be -1")
        console.log("getBoardInfoTest Passed");

    }
}
