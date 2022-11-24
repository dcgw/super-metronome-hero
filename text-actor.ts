import type {Vector} from "excalibur";
import {Actor} from "excalibur";
import type Text from "@dcgw/excalibur-text";
import type {TextOptions} from "./text-graphic.js";
import {textGraphic} from "./text-graphic.js";

export interface TextActorOptions extends TextOptions {
    readonly pos: Vector;
    readonly visible?: boolean | undefined;
}

export function textActor(options: TextActorOptions): readonly [Text, Actor] {
    const graphic = textGraphic(options);

    const actor = new Actor({
        pos: options.pos,
        visible: options.visible
    });

    actor.graphics.add(graphic);

    return [graphic, actor];
}
