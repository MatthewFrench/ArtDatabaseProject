import {Query} from "../../Database/Query";
import {TileUpdateQueue} from "./TileUpdateQueue";

export class AdminTools {


    /**
     * Do not run this.
     */
    static async HardCoreRevertCauseIScrewedUp() {
        if (1 === 1) {
            return;
        }
        console.log('Loading entire history of tiles');
        let entireTileHistory = await Query.GetEntireHistoryOfTiles();
        console.log('Finished loading entire history of tiles');
        console.log('Loading banned players');
        let bannedPlayersResults = await Query.GetBannedPlayers();
        console.log('Finished banning players');
        let bannedPlayerIDs = [];
        for (let info of bannedPlayersResults) {
            bannedPlayerIDs.push(info['player_id']);
        }

        //Sorting history by tile id
        console.log('Sorting history by tile_id');

        let historyMap = new Map<number, any>();
        for (let historyItem of entireTileHistory) {
            let tile_id = historyItem['tile_id'];
            let tileHistoryArray = [];
            if (historyMap.has(tile_id)) {
                tileHistoryArray = historyMap.get(tile_id);
            } else {
                historyMap.set(tile_id, tileHistoryArray);
            }
            tileHistoryArray.push(historyItem);
        }

        console.log('Sorting history tiles by date');

        //Sort all history item arrays
        historyMap.forEach((historyArray, tile_id)=>{
            historyArray.sort(function(history1, history2){return history1['date_time'] - history2['date_time']});
        });

        console.log('Get history of tiles affected by banned players');

        //Get every history of every tile affected by a banned player
        let bannedHistoryMap = new Map<number, any>();
        historyMap.forEach((historyArray, tile_id)=>{
            let affectedByBan = false;
            for (let item of historyArray) {
                if (bannedPlayerIDs.indexOf(item['player_id']) !== -1) {
                    affectedByBan = true;
                    break;
                }
            }
            if (affectedByBan) {
                bannedHistoryMap.set(tile_id, historyArray);
            }
        });

        console.log('Test');


        let revertToArray = [];
        bannedHistoryMap.forEach((historyArray, tile_id)=>{
            let revertTo = null;
            for (let historyItem of historyArray) {
                let a = historyItem['color_a'];
                let r = historyItem['color_r'];
                let g = historyItem['color_g'];
                let b = historyItem['color_b'];
                let date = historyItem['date_time'];
                let player_id = historyItem['player_id'];
                let tile_id = historyItem['tile_id'];
                let type_id = historyItem['type_id'];
                let board_id = historyItem['board_id'];
                let x = historyItem['x'];
                let y = historyItem['y'];
                if (bannedPlayerIDs.indexOf(player_id) !== -1) {
                    break;
                } else {
                    revertTo = historyItem;
                }
            }
            if (revertTo === null) {
                revertTo = historyArray[historyArray.length - 1];
                revertTo['type_id'] = 6; //Set to deleted
                revertTo['player_id'] = 1;
            }
            if (revertTo['type_id'] === null) {
                revertTo['type_id'] = 6;
            }
            revertToArray.push(revertTo);
        });

        console.log('Ready to revert');

        for (let historyRow of revertToArray) {
            let boardID = historyRow['board_id'];
            let r = historyRow['color_r'];
            let g = historyRow['color_g'];
            let b = historyRow['color_b'];
            let a = historyRow['color_a'];
            let x = historyRow['x'];
            let y = historyRow['y'];
            let typeID = historyRow['type_id'];
            let playerID = historyRow['player_id'];
            await TileUpdateQueue.AddTileUpdateToQueue(boardID, x, y, r, g, b, a, playerID, typeID);
        }

/*
        let badTiles1 = await Query.GetAllGriefedTiles();
        console.dir(badTiles1);

        //Get stuff
        let lastGoodHistory = await Query.GetLastGoodHistoryForGriefedTiles();
        console.dir(lastGoodHistory);
        for (let historyRow of lastGoodHistory) {
            let boardID = historyRow['board_id'];
            let r = historyRow['color_r'];
            let g = historyRow['color_g'];
            let b = historyRow['color_b'];
            let a = historyRow['color_a'];
            let x = historyRow['x'];
            let y = historyRow['y'];
            let typeID = historyRow['type_id'];
            let playerID = historyRow['player_id'];
            await TileUpdateQueue.AddTileUpdateToQueue(boardID, x, y, r, g, b, a, playerID, typeID);
        }
        await TileUpdateQueue.FlushTileUpdateQueue();
        console.dir(lastGoodHistory);

        //Now reset the rest of the tiles
        let badTiles = await Query.GetAllGriefedTiles();
        console.dir(badTiles);
        */
    }

    static async RemoveBannedPlayerTiles() {

    }
    static async BanPlayer() {

    }
}