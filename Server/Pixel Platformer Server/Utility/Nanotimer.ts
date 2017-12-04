import {Stopwatch} from "./Stopwatch";

export class NanoTimer {
    isRunning = false;
    isLooping = false;
    callback;
    milliseconds;
    lastRunStopwatch = new Stopwatch();
    constructor(callback, milliseconds) {
        this.callback = callback;
        this.milliseconds = milliseconds;
        this.lastRunStopwatch.reset();
        this.lastRunStopwatch.start();
    }
    private loop = () => {
        if (this.isLooping || !this.isRunning) {
            return;
        }
        this.isLooping = true;

        let elapsed = this.lastRunStopwatch.getMilliseconds();
        let timeUntilNextCallback = this.milliseconds - elapsed;
        if (timeUntilNextCallback <= 0) {
            console.log('Overdone: ' + timeUntilNextCallback);

            let delta = elapsed / this.milliseconds;

            this.lastRunStopwatch.reset();
            this.lastRunStopwatch.addSeconds(Math.abs(timeUntilNextCallback) / 1000.0);
            this.lastRunStopwatch.start();
            this.callback(delta);
            elapsed = this.lastRunStopwatch.getMilliseconds();
            timeUntilNextCallback = this.milliseconds - elapsed;

            console.log('Next callback: ' + timeUntilNextCallback);
            //console.log('Ran callback: ' + timeUntilNextCallback);
        }// else {
        //    console.log('No callback: ' + timeUntilNextCallback);
        //}

        this.isLooping = false;

        if (timeUntilNextCallback  <= 10) {
            if (timeUntilNextCallback <= 5) {
                setTimeout(this.loop,0);
            } else {
                setTimeout(this.loop,1);
            }
        } else {
            setTimeout(this.loop,2);
        }
    };
    start = () => {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.lastRunStopwatch.reset();
        this.lastRunStopwatch.start();
        this.loop();
    };
    stop = () => {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
    };
}