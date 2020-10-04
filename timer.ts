export default class Timer {
    public time = 0;
    public beat = 0;
    public isBeat = false;
    public isOffBeat = false;
    public offBeatMs = 0;

    private running = false;

    public constructor(private bpm: number) {
    }

    public update(delta: number): void {
        if (this.running) {
            const period = 60000 / this.bpm;
            this.time += delta;
            const previousBeat = this.beat;
            this.beat = this.time / period;
            this.isBeat = Math.floor(this.beat) > Math.floor(previousBeat);
            this.isOffBeat = this.beat > 1
                && Math.floor(this.beat + 0.5) > Math.floor(previousBeat + 0.5);
            this.offBeatMs = Math.abs(this.time - Math.round(this.beat) * period);
        }
    }

    public reset(bpm: number): void {
        this.running = false;
        this.bpm = bpm;
        this.time = 0;
        this.beat = 0;
    }

    public start(): void {
        this.running = true;
    }
}