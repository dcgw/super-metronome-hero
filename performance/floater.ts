import type Text from "@dcgw/excalibur-text";
import type {Engine} from "excalibur";
import {Actor, Color, Vector} from "excalibur";
import {textGraphic} from "../text-graphic.js";

const speed = 3 * 60;

export default class Floater extends Actor {
    private readonly textGraphic: Text;

    public constructor(text: string, color: Color) {
        super({
            pos: new Vector(320, 240),
            vel: Vector.fromAngle(Math.random() * Math.PI * 2).scale(speed)
        });

        this.textGraphic = textGraphic({
            text,
            color,
            fontSize: 72,
            outlineColor: Color.fromRGB(0, 0, 0, 0.6),
            shadowBlurRadius: 3
        });

        this.graphics.add(this.textGraphic);
    }

    public override update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        const opacity = Math.max(0, this.textGraphic.opacity - (0.05 * delta * 60) / 1000);
        this.textGraphic.opacity = opacity;

        if (opacity <= 0) {
            this.kill();
        }
    }
}
