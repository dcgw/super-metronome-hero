import {Actor, Engine, Vector} from "excalibur";
import resources from "../resources";

export default class Arm extends Actor {
    private shake = 0;
    private tick = false;

    constructor() {
        super({
            pos: new Vector(320, 420),
            anchor: new Vector(33 / 69, 340 / 355),
            width: 69,
            height: 355
        });

        this.addDrawing(resources.performanceArm);
    }

    public miss(): void {
        this.shake = 1 / 60 * 1000;
        resources.performanceMiss.play()
            .then(() => void 0,
                reason => console.error("", reason));
    }

    public tickTock(): void {
        this.tick = !this.tick;
        (this.tick ? resources.performanceTick : resources.performanceTock)
            .play()
            .then(() => void 0,
                reason => console.error("", reason));
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.shake > 0) {
            this.scale.setTo(0.9, 1.02);
            this.shake -= delta;
        } else {
            this.scale.setTo(1, 1);
        }
    }

    public reset(): void {
        this.shake = 0;
        this.tick = false;
    }

    public beat(beat: number): void {
        this.rotation = Math.sin(beat * Math.PI) * 30 / 180 * Math.PI;
    }
}