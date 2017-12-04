import {Stopwatch} from "./Stopwatch";

export class NanoTimer {
    isRunning = false;
    isLooping = false;
    callback;
    milliseconds;
    consistencyStopwatch = new Stopwatch();
    timeSinceLastStopwatch = new Stopwatch();
    constructor(callback, milliseconds) {
        this.callback = callback;
        this.milliseconds = milliseconds;
        this.consistencyStopwatch.reset();
        this.consistencyStopwatch.start();
        this.timeSinceLastStopwatch.reset();
        this.timeSinceLastStopwatch.start();
    }
    private loop = () => {
        if (this.isLooping || !this.isRunning) {
            return;
        }
        this.isLooping = true;

        let elapsed = this.consistencyStopwatch.getMilliseconds();
        let timeUntilNextCallback = this.milliseconds - elapsed;
        if (timeUntilNextCallback <= 0) {
            let timeSinceLast = this.timeSinceLastStopwatch.getMilliseconds();
            this.timeSinceLastStopwatch.reset();
            this.timeSinceLastStopwatch.start();
            let delta = timeSinceLast / this.milliseconds;

            this.consistencyStopwatch.reset();
            this.consistencyStopwatch.addSeconds(Math.abs(timeUntilNextCallback) / 1000.0);
            this.consistencyStopwatch.start();
            this.callback(delta);
            elapsed = this.consistencyStopwatch.getMilliseconds();
            timeUntilNextCallback = this.milliseconds - elapsed;
        }

        this.isLooping = false;

        if (timeUntilNextCallback  <= 10) {
            if (timeUntilNextCallback <= 5) {
                if (timeUntilNextCallback <= 0.5) {
                    if (timeUntilNextCallback <= -this.milliseconds) {
                        this.loop();
                    } else {
                        setImmediate(this.loop);
                    }
                } else {
                    setTimeout(this.loop,0);
                }
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
        this.consistencyStopwatch.reset();
        this.consistencyStopwatch.start();
        this.loop();
    };
    stop = () => {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
    };
}