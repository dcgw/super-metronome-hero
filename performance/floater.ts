import Label from "@dcgw/excalibur-extended-label";
import {Color, Engine, Vector} from "excalibur";
import {defaultLabelOptions} from "../defaults";

const speed = 3 * 60;

export default class Floater extends Label {
    public constructor(text: string, color: Color) {
        super({
            ...defaultLabelOptions,
            pos: new Vector(320, 240),
            vel: Vector.fromAngle(Math.random() * Math.PI * 2).scale(speed),
            text,
            color,
            fontSize: 72,
            outlineColor: Color.fromRGB(0, 0, 0, 0.6),
            shadowBlurRadius: 3
        });
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        const alpha = Math.max(0, this.color.a - (0.2 * delta * 60) / 1000);
        this.color.a = alpha;

        if (alpha <= 0) {
            this.kill();
        }
    }
}
