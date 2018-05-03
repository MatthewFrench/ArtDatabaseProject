import {Query} from "../Pixel Platformer Server/Database/Query";

beforeEach(function(){
  return new Promise(function(fulfill) {
    //Gotta call the callback to say we're done setting up
    fulfill();
  });
});

afterEach(function() {
  return new Promise(function(fulfill) {
      fulfill();
  });
});

//Test Function
test('This is my test function', function(done){
    expect(1).toEqual(1);
    expect(null).toBeNull();
  done();
});

test('changeBoardNameTest',async function(done){
    await Query.ChangeBoardName(58, "New Name");
    let results = await Query.GetBoardByID(58);
    expect(results.name).toEqual( "New Name");
    done();
});

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