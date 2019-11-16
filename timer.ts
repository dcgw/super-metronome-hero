export default class Timer {
    public time = 0;
    public beat = 0;

    constructor(private readonly bpm: number) {
    }

    public update(delta: number): void {
        const period = 60000 / this.bpm;
        this.time += delta;
        this.beat = this.time / period;
    }
}