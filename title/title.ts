import type {Engine} from "excalibur";
import {Actor, Color, Scene, TextAlign, Traits, Vector} from "excalibur";
import type Game from "../game.js";
import Timer from "../metronome/timer.js";
import resources from "../resources.js";
import {textActor} from "../text-actor.js";

export default class Title extends Scene {
    private readonly smallTimer = new Timer(60);
    private readonly bigTimer = new Timer(30);
    private readonly smallArm: Actor;
    private readonly bigArm: Actor;

    private readonly startText = textActor({
        text: "Press ANY key to start",
        pos: new Vector(320, 385),
        color: Color.fromHex("eeeeee"),
        textAlign: TextAlign.Center
    });

    public constructor(private readonly game: Game) {
        super();

        const background = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero
        });
        background.graphics.add(resources.titleBackground.toSprite());
        this.add(background);

        this.bigArm = new Actor({
            pos: new Vector(680, 1100),
            anchor: new Vector(129 / 257, 1300 / 1356)
        });
        this.bigArm.graphics.add(resources.titleBigArm.toSprite());

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
        body.graphics.add(resources.titleBody.toSprite());
        this.add(body);

        this.smallArm = new Actor({
            pos: new Vector(480, 268),
            anchor: new Vector(11 / 22, 150 / 153)
        });
        this.smallArm.graphics.add(resources.titleSmallArm.toSprite());
        this.add(this.smallArm);

        const logo = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero
        });
        logo.graphics.add(resources.titleLogo.toSprite());
        this.add(logo);

        this.add(this.startText[1]);
    }

    public override onActivate(): void {
        if (this.game.music.scene != null) {
            this.game.music.kill();
        }
        this.add(this.game.music);

        this.smallTimer.start();
        this.bigTimer.start();
    }

    public override update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.game.active) {
            this.game.music.play();
        }

        this.smallTimer.update(delta);
        this.bigTimer.update(delta);

        this.smallArm.rotation = ((Math.sin(this.smallTimer.beat * Math.PI) * 40) / 180) * Math.PI;
        this.bigArm.rotation = ((Math.sin(this.bigTimer.beat * Math.PI) * 50) / 180) * Math.PI;

        if (this.game.wasAnyKeyPressed()) {
            this.game.engine.goToScene("menu");
        }
    }
}
