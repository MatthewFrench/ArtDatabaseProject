/**
 * Handles precise tracking of time.
 */
export class Stopwatch {
    constructor() {
        this.startMilliseconds = window.performance.now();
        this.reset();
    }

    /**
     * Resets the stopwatch tracking.
     */
    reset() {
        this.startMilliseconds = window.performance.now();
    }

    /**
     * Returns the total milliseconds that has passed.
     * @returns {number}
     */
    getMilliseconds() {
        let currentMilliseconds = window.performance.now();
        return currentMilliseconds - this.startMilliseconds;
    }

    /**
     * Returns the total seconds that has passed.
     * @returns {number}
     */
    getSeconds() {
        let currentMilliseconds = window.performance.now();
        return (currentMilliseconds - this.startMilliseconds) / 1000.0;
    }

    /**
     * Returns the total minutes that has passed.
     * @returns {number}
     */
    getMinutes() {
        let currentMilliseconds = window.performance.now();
        return (currentMilliseconds - this.startMilliseconds) / 1000.0 / 60.0;
    }

    /**
     * Returns the total hours that has passed.
     * @returns {number}
     */
    getHours() {
        let currentMilliseconds = window.performance.now();
        return (currentMilliseconds - this.startMilliseconds) / 1000.0 / 60.0 / 60.0;
    };
}