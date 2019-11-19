import {Actor, Engine, Scene, Vector} from "excalibur";
import Game from "../game";
import resources from "../resources";
import Timer from "../timer";

export default class Title extends Scene {
    private readonly smallTimer = new Timer(60);
    private readonly bigTimer = new Timer(30);
    private readonly smallArm: Actor;
    private readonly bigArm: Actor;

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
    }

    public onActivate(): void {
        resources.titleMusic.loop = true;

        this.smallTimer.start();
        this.bigTimer.start();

        this.game.engine.input.keyboard.on("press", this.onKeyPress);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.game.active) {
            ensureMusicPlaying();
        }

        this.smallTimer.update(delta);
        this.bigTimer.update(delta);

        this.smallArm.rotation = Math.sin(this.smallTimer.beat * Math.PI) * 40 / 180 * Math.PI;
        this.bigArm.rotation = Math.sin(this.bigTimer.beat * Math.PI) * 50 / 180 * Math.PI;
    }

    private readonly onKeyPress = () => {
        ensureMusicPlaying();
        this.game.engine.goToScene("menu");
    }
}

function ensureMusicPlaying(): void {
    if (!resources.titleMusic.isPlaying()) {
        resources.titleMusic.play()
            .then(() => void 0,
                reason => console.error("", reason));
    }
}