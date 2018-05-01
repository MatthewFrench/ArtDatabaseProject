/**
 * Created by matt on 10/7/16.
 */

/**
 * Handles precise tracking of time.
 */
const NS_PER_HOUR = 3.6e12;
const NS_PER_MINUTE = 6e10;
const NS_PER_SEC = 1e9;
const NS_PER_MS = 1000000;
export class Stopwatch {
    //Holds an array of time intervals that have previously existed. Fills up by pausing.
    timeArray = [];
    //The latest current time of the stopwatch
    startTime: any = null;
    constructor(startSeconds = 0) {
        this.reset(startSeconds);
    }

    /**
     * Returns true if the stopwatch is paused.
     * @returns {boolean}
     */
    isPaused() {
        return this.startTime === null;
    }

    /**
     * Clears recorded time.
     */
    clearTime() {
        this.timeArray = [];
    }

    /**
     * Resets the stopwatch tracking.
     */
    reset(startSeconds = 0) {
        this.clearTime();
        if (startSeconds != 0) {
            this.addSeconds(startSeconds);
        }
        this.start();
    }

    setSeconds(seconds) {
        this.clearTime();
        this.addSeconds(seconds);
    }

    /**
     * Pushed a time interval into the array and stops the start time.
     */
    pause() {
        this.timeArray.push(this.getNanosecondsInCurrentInterval());
        this.startTime = null;
    }

    /**
     * Starts the start time, continues if the stopwatch wasn't reset.
     */
    start() {
        this.startTime = process.hrtime();
    }

    /**
     * Adds seconds to the timer
     */
    addSeconds(seconds) {
        this.timeArray.push(seconds * NS_PER_SEC);
    }

    /**
     * Returns only the nanoseconds since the start interval.
     * @returns {number}
     */
    getNanosecondsInCurrentInterval() {
        if (this.startTime === null) {
            return 0;
        }
        let diff = process.hrtime(this.startTime);
        return diff[0] * NS_PER_SEC + diff[1];
    }

    /**
     * Returns the passed nanoseconds.
     * @returns {number}
     */
    getNanoseconds() {
        let nanoseconds = 0;
        for (let time of this.timeArray) {
            nanoseconds += time;
        }
        nanoseconds += this.getNanosecondsInCurrentInterval();
        return nanoseconds;
    }

    /**
     * Returns the total milliseconds that has passed.
     * @returns {number}
     */
    getMilliseconds() {
        return this.getNanoseconds() / NS_PER_MS;
    }

    /**
     * Returns the total seconds that has passed.
     * @returns {number}
     */
    getSeconds() {
        return this.getNanoseconds() / NS_PER_SEC;
    }

    /**
     * Returns the total minutes that has passed.
     * @returns {number}
     */
    getMinutes() {
        return this.getNanoseconds() / NS_PER_MINUTE;
    }

    /**
     * Returns the total hours that has passed.
     * @returns {number}
     */
    getHours() {
        return this.getNanoseconds() / NS_PER_HOUR;
    };
}