import {Actor, BaseAlign, Color, Engine, FontUnit, Label, SpriteSheet, Vector} from "excalibur";
import Game from "../game";
import resources from "../resources";

export interface Options {
    readonly pos: Vector;
    readonly tempo: string;
    readonly bpm: number;
    readonly textSize?: number;
}

const boxWidth = 500;
const boxHeight = 100;

const boxSpriteSheet = new SpriteSheet({
    image: resources.menuItem,
    spWidth: boxWidth,
    spHeight: boxHeight,
    rows: 1,
    columns: 4
});

const ratingWidth = 70;
const ratingHeight = 70;

const ratingSpriteSheet = new SpriteSheet({
    image: resources.menuItemRatings,
    spWidth: ratingWidth,
    spHeight: ratingHeight,
    rows: 1,
    columns: 5
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
        text: "Locked",
        pos: new Vector(100, 20),
        fontFamily: Game.fontFamily,
        fontSize: 60,
        fontUnit: FontUnit.Px,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("999999")
    });

    private readonly labelText = new Label({
        pos: new Vector(100, 10),
        fontFamily: Game.fontFamily,
        fontUnit: FontUnit.Px,
        baseAlign: BaseAlign.Top,
        color: Color.White,
        visible: false
    });

    private readonly subText = new Label({
        pos: new Vector(100, 65),
        fontFamily: Game.fontFamily,
        fontSize: 22,
        fontUnit: FontUnit.Px,
        baseAlign: BaseAlign.Top,
        color: Color.White,
        visible: false
    });

    constructor(options: Options) {
        super({
            pos: options.pos,
            width: boxWidth,
            height: boxHeight,
            anchor: Vector.Zero
        });

        this.tempo = options.tempo;
        this.bpm = options.bpm;

        this.box.addDrawing("locked", boxSpriteSheet.getSprite(0));
        this.box.addDrawing("unlocked", boxSpriteSheet.getSprite(1));
        this.box.addDrawing("locked-glow", boxSpriteSheet.getSprite(2));
        this.box.addDrawing("unlocked-glow", boxSpriteSheet.getSprite(3));
        this.add(this.box);

        this.rating.addDrawing("locked", ratingSpriteSheet.getSprite(0));
        this.rating.addDrawing("0", ratingSpriteSheet.getSprite(1));
        this.rating.addDrawing("1", ratingSpriteSheet.getSprite(2));
        this.rating.addDrawing("2", ratingSpriteSheet.getSprite(3));
        this.rating.addDrawing("3", ratingSpriteSheet.getSprite(4));
        this.add(this.rating);

        this.add(this.lockedText);

        this.labelText.fontSize = options.textSize || 60;
        this.labelText.text = options.tempo;
        this.add(this.labelText);

        this.subText.text = options.bpm + " bpm";
        this.add(this.subText);
    }


    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.box.setDrawing(
            (this.locked ? "locked" : "unlocked")
            + (this.selected ? "-glow" : ""));

        this.rating.setDrawing(this.locked
            ? "locked"
            : this.stars.toString(10));

        this.lockedText.visible = this.locked;
        this.labelText.visible = this.subText.visible = !this.locked;
    }
}