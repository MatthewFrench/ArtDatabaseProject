import {Stopwatch} from "./Stopwatch";

const NS_PER_HOUR = 3.6e12;
const NS_PER_MINUTE = 6e10;
const NS_PER_SEC = 1e9;
const NS_PER_MS = 1000000;

export class Benchmark {
    benchmarkStopwatch = new Stopwatch();
    timeArray = [];
    prettyPrintIntervalStopwatch = new Stopwatch();
    name = '';

    constructor(name) {
        this.name = name;
    }

    start() {
        this.benchmarkStopwatch.reset();
        this.benchmarkStopwatch.start();
    }

    stop() {
        this.benchmarkStopwatch.pause();
        this.timeArray.push([Benchmark.GetCurrentTimeInMilliseconds(), this.benchmarkStopwatch.getMilliseconds()]);
    }

    prettyPrintAtInterval(seconds, snapshotInterval) {
        if (this.prettyPrintIntervalStopwatch.getSeconds() >= seconds) {
            this.prettyPrintIntervalStopwatch.reset();
            this.prettyPrintResults(snapshotInterval);
        }
    }

    prettyPrintResults(lastSecondsSnapshot) {
        if (this.timeArray.length === 0) {
            return;
        }
        let minimumTime = null;
        let maximumTime = null;
        let averageTime = 0;
        for (let entry of this.timeArray) {
            if (minimumTime === null || entry[1] < minimumTime) {
                minimumTime = entry[1];
            }
            if (maximumTime === null || entry[1] > maximumTime) {
                maximumTime = entry[1];
            }
            averageTime += entry[1] / this.timeArray.length;
        }

        let snapshotEntries = this.getTimeEntriesInSnapshot(lastSecondsSnapshot);
        let snapshotMinimumTime = null;
        let snapshotMaximumTime = null;
        let snapshotAverageTime = 0;
        for (let entry of snapshotEntries) {
            if (snapshotMinimumTime === null || entry[1] < snapshotMinimumTime) {
                snapshotMinimumTime = entry[1];
            }
            if (snapshotMaximumTime === null || entry[1] > snapshotMaximumTime) {
                snapshotMaximumTime = entry[1];
            }
            snapshotAverageTime += entry[1] / snapshotEntries.length;
        }

        console.log(this.name + ' Benchmark : ' + (new Date()).toLocaleString());
        console.log('\tMinimum Time: ' + minimumTime.toFixed(2) + 'ms' +
            ' | Snapshot '+ lastSecondsSnapshot +' Minimum Time: ' + snapshotMinimumTime.toFixed(2) + 'ms');
        console.log('\tMaximum Time: ' + maximumTime.toFixed(2) + 'ms' +
            ' | Snapshot '+ lastSecondsSnapshot +' Maximum Time: ' + snapshotMaximumTime.toFixed(2) + 'ms');
        console.log('\tAverage Time: ' + averageTime.toFixed(2) + 'ms' +
            ' | Snapshot '+ lastSecondsSnapshot +' Average Time: ' + snapshotAverageTime.toFixed(2) + 'ms');
    }

    getTimeEntriesInSnapshot(seconds) {
        let currentTime = Benchmark.GetCurrentTimeInMilliseconds();

        let entries = [];

        for (let entry of this.timeArray) {
            if ((currentTime - entry[0]) <= seconds * 1000) {
                entries.push(entry);
            }
        }

        return entries;
    }

    clearHistoryAfterDuration(seconds) {
        let currentTime = Benchmark.GetCurrentTimeInMilliseconds();
        this.timeArray = this.timeArray.filter(entry => (currentTime - entry[0]) <= seconds * 1000);
    }

    static GetCurrentTimeInMilliseconds() {
        let diff = process.hrtime();
        return (diff[0] * NS_PER_SEC + diff[1]) / NS_PER_MS;
    }
}