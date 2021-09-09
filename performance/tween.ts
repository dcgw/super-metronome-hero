import type {Engine} from "excalibur";
import {Actor, EasingFunctions} from "excalibur";

export default class Tween extends Actor {
    private playing = false;
    private time = 0;

    public constructor(
        private readonly duration: number,
        private readonly action: (factor: number) => void,
        private readonly easing = EasingFunctions.Linear,
        private readonly onEnd = () => {}
    ) {
        super();
    }

    public reset(): void {
        this.playing = false;
        this.time = 0;
    }

    public async play(): Promise<void> {
        this.playing = true;
        this.time = 0;

        return new Promise(resolve => {
            this.resolvePromise = resolve;
        });
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.playing) {
            this.time += delta;
            if (this.time >= this.duration) {
                this.action(this.easing(this.duration, 0, 1, this.duration));
                this.resolvePromise();
                this.onEnd();
                this.playing = false;
            } else {
                this.action(this.easing(this.time, 0, 1, this.duration));
            }
        }
    }

    private resolvePromise = (): void => {};
}
