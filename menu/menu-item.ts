import type Text from "@dcgw/excalibur-text";
import {notNull} from "@softwareventures/nullable";
import type {Engine} from "excalibur";
import {Actor, Color, SpriteSheet, Vector} from "excalibur";
import resources from "../resources.js";
import {textActor} from "../text-actor.js";

export interface Options {
    readonly pos: Vector;
    readonly tempo: string;
    readonly bpm: number;
    readonly textSize?: number;
}

const boxWidth = 500;
const boxHeight = 100;

const boxSpriteSheet = SpriteSheet.fromImageSource({
    image: resources.menuItem,
    grid: {
        spriteWidth: boxWidth,
        spriteHeight: boxHeight,
        rows: 1,
        columns: 4
    }
});

const ratingWidth = 70;
const ratingHeight = 70;

const ratingSpriteSheet = SpriteSheet.fromImageSource({
    image: resources.menuItemRatings,
    grid: {
        spriteWidth: ratingWidth,
        spriteHeight: ratingHeight,
        rows: 1,
        columns: 5
    }
});

export default class MenuItem extends Actor {
    public readonly tempo: string;
    public readonly bpm: number;

    public selected = false;
    public locked = true;
    public stars = 0;

    private readonly box = new Actor({
        pos: Vector.Zero,
        width: boxWidth,
        height: boxHeight,
        anchor: Vector.Zero
    });

    private readonly rating = new Actor({
        pos: new Vector(15, 15),
        width: ratingWidth,
        height: ratingHeight,
        anchor: Vector.Zero
    });

    private readonly lockedText = textActor({
        text: "Locked",
        pos: new Vector(100, 20),
        fontSize: 60,
        color: Color.fromHex("999999")
    });

    private readonly labelText: readonly [Text, Actor];

    private readonly subText = textActor({
        pos: new Vector(100, 65),
        fontSize: 22,
        outlineColor: Color.fromRGB(0, 0, 0, 0.45),
        shadowBlurRadius: 1.5,
        visible: false
    });

    public constructor(options: Options) {
        super({
            pos: options.pos,
            width: boxWidth,
            height: boxHeight,
            anchor: Vector.Zero
        });

        this.tempo = options.tempo;
        this.bpm = options.bpm;

        this.box.graphics.add("locked", notNull(boxSpriteSheet.getSprite(0, 0)));
        this.box.graphics.add("unlocked", notNull(boxSpriteSheet.getSprite(1, 0)));
        this.box.graphics.add("locked-glow", notNull(boxSpriteSheet.getSprite(2, 0)));
        this.box.graphics.add("unlocked-glow", notNull(boxSpriteSheet.getSprite(3, 0)));
        this.addChild(this.box);

        this.rating.graphics.add("locked", notNull(ratingSpriteSheet.getSprite(0, 0)));
        this.rating.graphics.add("0", notNull(ratingSpriteSheet.getSprite(1, 0)));
        this.rating.graphics.add("1", notNull(ratingSpriteSheet.getSprite(2, 0)));
        this.rating.graphics.add("2", notNull(ratingSpriteSheet.getSprite(3, 0)));
        this.rating.graphics.add("3", notNull(ratingSpriteSheet.getSprite(4, 0)));
        this.addChild(this.rating);

        this.addChild(this.lockedText[1]);

        this.labelText = textActor({
            pos: new Vector(100, 10),
            text: options.tempo,
            fontSize: options.textSize ?? 60,
            visible: false
        });
        this.addChild(this.labelText[1]);

        this.subText[0].text = `${options.bpm} bpm`;
        this.addChild(this.subText[1]);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.box.graphics.show(
            (this.locked ? "locked" : "unlocked") + (this.selected ? "-glow" : "")
        );

        this.rating.graphics.show(this.locked ? "locked" : this.stars.toString(10));

        this.lockedText[1].visible = this.locked;
        this.labelText[1].visible = this.subText[1].visible = !this.locked;
    }
}
