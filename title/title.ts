import {Actor, BaseAlign, Color, Engine, FontUnit, Label, Scene, TextAlign, Traits, Vector} from "excalibur";
import Game from "../game";
import resources from "../resources";
import Timer from "../timer";

export default class Title extends Scene {
    private readonly smallTimer = new Timer(60);
    private readonly bigTimer = new Timer(30);
    private readonly smallArm: Actor;
    private readonly bigArm: Actor;

    private readonly startText = new Label({
        text: "Press ANY key to start",
        pos: new Vector(320, 385),
        fontFamily: Game.fontFamily,
        fontSize: 48,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("eeeeee")
    });

    constructor(private readonly game: Game) {
        super(game.engine);

        const background = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero
        });
        background.addDrawing(resources.titleBackground);
        this.add(background);

        this.bigArm = new Actor({
            pos: new Vector(680, 1100),
            anchor: new Vector(129 / 257, 1300 / 1356)
        });
        this.bigArm.addDrawing(resources.titleBigArm);

        this.bigArm.traits.forEach((trait, index) => {
            if (trait instanceof Traits.OffscreenCulling) {
                this.bigArm.traits.splice(index, 1);
            }
        });
        this.add(this.bigArm);

        const body = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero
        });
        body.addDrawing(resources.titleBody);
        this.add(body);

        this.smallArm = new Actor({
            pos: new Vector(480, 268),
            anchor: new Vector(11 / 22, 150 / 153)
        });
        this.smallArm.addDrawing(resources.titleSmallArm);
        this.add(this.smallArm);

        const logo = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero
        });
        logo.addDrawing(resources.titleLogo);
        this.add(logo);

        this.add(this.startText);
    }

    public onActivate(): void {
        this.game.music.kill();
        this.add(this.game.music);

        this.smallTimer.start();
        this.bigTimer.start();

        this.game.engine.input.keyboard.on("press", this.onKeyPress);
    }

    public onDeactivate(): void {
        this.game.engine.input.keyboard.off("press", this.onKeyPress);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.game.active) {
            this.game.music.play();
        }

        this.smallTimer.update(delta);
        this.bigTimer.update(delta);

        this.smallArm.rotation = Math.sin(this.smallTimer.beat * Math.PI) * 40 / 180 * Math.PI;
        this.bigArm.rotation = Math.sin(this.bigTimer.beat * Math.PI) * 50 / 180 * Math.PI;
    }

    private readonly onKeyPress = () => this.game.engine.goToScene("menu");
}