export default class Timer {
    public time = 0;
    public beat = 0;
    public isBeat = false;

    private running = false;

    constructor(private bpm: number) {
    }

    public update(delta: number): void {
        if (this.running) {
            const period = 60000 / this.bpm;
            this.time += delta;
            const previousBeat = this.beat;
            this.beat = this.time / period;
            this.isBeat = Math.floor(this.beat) > Math.floor(previousBeat);
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