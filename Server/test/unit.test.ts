import {Configuration} from "../Pixel Platformer Server/Configuration";
import {Query} from "../Pixel Platformer Server/Database/Query";
import {equal} from "assert";

beforeEach(function () {
    return new Promise(function (fulfill) {
        Configuration.Initialize(); //Load the config file
        Query.Initialize();
        //Gotta call the callback to say we're done setting up
        fulfill(null);
    });
});

afterEach(function () {
    return new Promise(function (fulfill) {
        fulfill(null);
    });
});

//Test Function
test('This is my test function', function (done) {
    expect(1).toEqual(1);
    expect(null).toBeNull();
    done();
});

test('changeBoardNameTest', async function (done) {
    await Query.ChangeBoardName(58, "New Name");
    let results = await Query.GetBoardByID(58);
    expect(results.name).toEqual("New Name");
    done();
});

test('createBoardTest', async function (done) {

    var info = await Query.CreateBoard("hello", "hahahahahaahaahhaahaeiordwfjakf");
    expect(Number.isInteger(info)).toEqual(true);
    done();
});

test('userLoginTest', async function (done) {
    var response = await Query.UserLogin('username', 'password');

    expect(response['player_id']).toEqual(117);
    expect(response['display_name']).toEqual('username');
    expect(response['email']).toEqual('na@na.com');


    var wrongUsernameResponse = await Query.UserLogin('notworking', 'wrong');
    expect(wrongUsernameResponse).toEqual(null);

    var wrongPassResponse = await Query.UserLogin('username', 'wrong');
    expect(wrongPassResponse).toEqual(null);

    done();
});

test('createUserTest', async function (done) {
    let result = await Query.CreateAccount(new Date(), new Date(), "pass", "email");

    expect(result).toEqual(true);

    let broke = await Query.CreateAccount('usernamer', 'username', 'hello', 'email')
    expect(broke).toEqual(false);
    done();
});

test('connectionFailureTest', async function (done) {
    Query.MockDestroyDatabaseInstanceForTesting();

    let result = await Query.UseConnection(() => {
    });
    expect(result).toEqual(false);
    done();
});

test('GetAllGriefedTilesTest', async function (done) {
    let result = await Query.GetAllGriefedTiles();

    expect(result);
    done();

});

test('GetEntireHistoryOfTiles', async function (done) {
    let result = await Query.GetEntireHistoryOfTiles(5);

    expect(result);
    done();

});

test('GetBannedPlayers', async function (done) {
    let result = await Query.GetBannedPlayers();

    expect(result);
    done();

});

test('SetPlayerLocation', async function (done) {
    let result = await Query.SetPlayerLocation(1, 0, 0, 1);

    expect(result);
    done();

});

test('GetPlayerLocation', async function (done) {
    let result = await Query.GetPlayerLocation(1);

    expect(result).toBeTruthy();
    result = await Query.GetPlayerLocation("-asassa82356798234659386451");

    expect(result).toEqual({});

    done();

});

test('GetLastGoodHistoryForGriefedTiles', async function (done) {
    let result = await Query.GetLastGoodHistoryForGriefedTiles();

    expect(result);
    done();

});


test('SetPlayerSprite', async function (done) {
    let result = await Query.SetPlayerSprite(1, 1);

    expect(result);
    done();

});

test('GetPlayerSprite', async function (done) {
    let result = await Query.GetPlayerSprite(1);

    expect(result);
    done();

});

test('UpdateDisplayName', async function (done) {
    let result = await Query.UpdateDisplayName(1, 'Blah');

    expect(result);
    done();

});

test('UpdatePassword', async function (done) {
    let result = await Query.UpdatePassword(1, 'blah');

    expect(result);
    done();

});

test('RemoveBoard', async function (done) {
    let result = await Query.CreateBoard(new Date(), "12");
    await Query.RemoveBoard(result);

    expect(result);
    done();

});

test('GetAllBoards', async function (done) {
    let result = await Query.GetAllBoards();

    expect(result);
    done();

});

test('GetAllSprites', async function (done) {
    let result = await Query.GetAllSprites();

    expect(result);
    done();

});

test('MakeAdmin', async function (done) {
    let result = await Query.MakeAdmin(1, "Admin");

    expect(result);
    done();

});

test('RemoveAdmin', async function (done) {
    let result = await Query.RemoveAdmin(1);

    expect(result);
    done();

});

test('BatchUpdateTileColors', async function (done) {
    await Query.UseConnection(async function (connection) {
        let result = await Query.BatchUpdateTileColors(connection,
            [{
                boardID: 1,
                x: 0,
                y: 0,
                r: 0,
                g: 0,
                b: 0,
                a: 0,
                creatorOrLastModifiedID: 1
            }]);

        expect(result);
        done();
    });
});

test('BatchUpdateTileTypes', async function (done) {
    await Query.UseConnection(async function (connection) {
        let result = await Query.BatchUpdateTileTypes(connection,
            [{
                boardID: 1,
                x: 0,
                y: 0,
                tileTypeID: 1
            }]);
        expect(result);
        done();
    });
});

test('BatchInsertHistoryAndHistoryType', async function (done) {
    await Query.UseConnection(async function (connection) {
        let result = await Query.BatchInsertHistoryAndHistoryType(connection,
            [{
                boardID: 1,
                x: 0,
                y: 0,
                r: 0,
                g: 0,
                b: 0,
                a: 0,
                tileTypeID: 1,
                time: new Date(),
                creatorOrLastModifiedID: 1
            }]);

        expect(result);
        done();
    });

});

test('getSpriteTest', async function (done) {
    //Query
    let spriteResults = await Query.GetSprites();

    var correct = JSON.stringify([{"sprite_id": 1, "image_url": "M_TOPHAT_BROWN"}, {
        "sprite_id": 2,
        "image_url": "M_TOPHAT_BLACK"
    }, {"sprite_id": 3, "image_url": "M_NEWSBOY"}, {"sprite_id": 4, "image_url": "M_DOCTOR_MASK"}, {
        "sprite_id": 5,
        "image_url": "M_DOCTOR_NOMASK"
    }, {"sprite_id": 6, "image_url": "F_NURSE"}, {"sprite_id": 7, "image_url": "M_DOCTOR_BLOODY"}, {
        "sprite_id": 8,
        "image_url": "M_TOPHAT_GLASSES"
    }]);


    expect(JSON.stringify(spriteResults)).toEqual(correct)
    done();
});


test('getAllTilesTest', async function (done) {
    //Query
    let results = await Query.GetAllTiles(20);

    expect(JSON.stringify(results));
    done();
});


test('insertTileTest', async function (done) {

    //Query
    let results = await Query.UpdateOrInsertTile(1, 0, 0, 0,
        0, 0, 0, 0, 3);


    expect(results).toEqual(74);
    done();
});

test('getBoardInfoTest', async function (done) {

    //Query
    let results = await Query.GetBoardByID(1);

    expect(results.board_id).toEqual(1);
    expect(results.name).toEqual("Home");
    expect(results.creator_id).toEqual(5);
    expect(results.is_deleted).toEqual(0);
    expect(results.max_width).toEqual(-1);
    expect(results.max_height).toEqual(-1);

    await Query.GetBoardByID(-1);

    done();

});