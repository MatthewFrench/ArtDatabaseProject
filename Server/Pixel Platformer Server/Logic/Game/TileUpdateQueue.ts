import {Query} from "../../Database/Query";
import {Utility} from "../../Utility/Utility";
import {Stopwatch} from "../../Utility/Stopwatch";


let queueList = [];
let maxQueueSize = 500;
let flushRunning = false;

export class TileUpdateQueue {
    static AddTileUpdateToQueue = async (boardID, x, y, r, g, b, a, creatorOrLastModifiedID, tileTypeID) => {
        queueList.push({boardID: boardID, x:x, y:y, r:r, g:g, b:b, a:a,
            creatorOrLastModifiedID: creatorOrLastModifiedID, tileTypeID:tileTypeID, time: new Date()});
        if (queueList.length >= maxQueueSize) {
            await TileUpdateQueue.FlushTileUpdateQueue();
        }
    };

    static FlushTileUpdateQueue = async() => {
        if (queueList.length === 0) {
            return;
        }
        if (flushRunning) {
            //console.log('Queue flush already running: ' + queueList.length);
            return;
        }
        console.log('Running queue flush: ' + queueList.length);
        let pushStopwatch = new Stopwatch();
        flushRunning = true;
        //Swap the queue list because this is an async function
        let currentQueueList = queueList;
        queueList = [];

        let tryCount = 0;
        let success = false;
        while (success === false && tryCount < 20) {
            success = await Query.UseConnection(async (connection)=>{
                await connection.beginTransaction();

                await Query.BatchUpdateTileColors(connection, currentQueueList);

                await Query.BatchUpdateTileTypes(connection, currentQueueList);

                await Query.BatchInsertHistoryAndHistoryType(connection, currentQueueList);

                await connection.commit();
            });
            if (!success) {
                console.log('Failed to push tiles');
                await Utility.Sleep(1000);
            }
            tryCount++;
        }

        console.log(`Ended tile update push, took ${Math.round(pushStopwatch.getMilliseconds())}ms`);

        flushRunning = false;

        if (queueList.length >= maxQueueSize) {
            await TileUpdateQueue.FlushTileUpdateQueue();
        }
    };
}