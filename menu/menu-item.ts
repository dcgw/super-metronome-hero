import Label from "@dcgw/excalibur-extended-label";
import {notNull} from "@softwareventures/nullable";
import type {Engine} from "excalibur";
import {Actor, Color, SpriteSheet, Vector} from "excalibur";
import {defaultLabelOptions} from "../defaults.js";
import resources from "../resources.js";

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

    private readonly lockedText = new Label({
        ...defaultLabelOptions,
        text: "Locked",
        pos: new Vector(100, 20),
        fontSize: 60,
        color: Color.fromHex("999999")
    });

    private readonly labelText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(100, 10),
        fontFamily: "Strait",
        visible: false
    });

    private readonly subText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(100, 65),
        fontFamily: "Strait",
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

        this.addChild(this.lockedText);

        this.labelText.fontSize = options.textSize ?? 60;
        this.labelText.text = options.tempo;
        this.addChild(this.labelText);

        this.subText.text = `${options.bpm} bpm`;
        this.addChild(this.subText);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.box.graphics.show(
            (this.locked ? "locked" : "unlocked") + (this.selected ? "-glow" : "")
        );

        this.rating.graphics.show(this.locked ? "locked" : this.stars.toString(10));

        this.lockedText.visible = this.locked;
        this.labelText.visible = this.subText.visible = !this.locked;
    }
}
