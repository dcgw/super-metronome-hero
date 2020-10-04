import {Color, Engine, FontUnit, Label, Vector} from "excalibur";

const speed = 3 * 60;

export default class Floater extends Label {
    public constructor(text: string, color: Color) {
        super({
            x: 320,
            y: 240,
            text,
            color,
            fontSize: 72,
            fontUnit: FontUnit.Px,
            vel: Vector.fromAngle(Math.random() * Math.PI * 2).scale(speed)
        });
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        const alpha = Math.max(0, this.color.a - ((0.2 * delta * 60) / 1000));
        this.color.a = alpha;

        if (alpha <= 0) {
            this.kill();
        }
    }
}
