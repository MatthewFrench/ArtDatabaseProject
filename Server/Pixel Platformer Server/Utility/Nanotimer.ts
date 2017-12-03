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
    }
    private loop = () => {
        if (this.isLooping || !this.isRunning) {
            return;
        }
        this.isLooping = true;

        let elapsed = this.lastRunStopwatch.getMilliseconds();
        let timeUntilNextCallback = this.milliseconds - elapsed;
        if (timeUntilNextCallback <= 0) {
            let delta = elapsed / this.milliseconds;
            this.lastRunStopwatch.reset((elapsed - this.milliseconds) / 1000.0);
            this.lastRunStopwatch.start();
            while(delta >= 1.75) {
                this.callback(1.0);
                delta -= 1;
            }
            this.callback(delta);
            elapsed = this.lastRunStopwatch.getMilliseconds();
            timeUntilNextCallback = this.milliseconds - elapsed;
        }

        this.isLooping = false;

        if (timeUntilNextCallback  <= 4) {
            if (timeUntilNextCallback <= 2) {
                setImmediate(this.loop);
            } else {
                setTimeout(this.loop,0);
            }
        } else {
            setTimeout(this.loop,1);
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