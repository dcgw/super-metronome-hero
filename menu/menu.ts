import {Actor, EasingFunctions, Engine, Input, Scene, Vector} from "excalibur";
import Game from "../game";
import resources from "../resources";
import MenuItem from "./menu-item";

export default class Menu extends Scene {
    private selectedIndex = 0;

    private readonly items: readonly MenuItem[] = [
        new MenuItem({pos: new Vector(70, 50), tempo: "Grave", bpm: 40}),
        new MenuItem({pos: new Vector(70, 170), tempo: "Adagio", bpm: 60}),
        new MenuItem({pos: new Vector(70, 290), tempo: "Moderato", bpm: 88}),
        new MenuItem({pos: new Vector(70, 410), tempo: "Allegro", bpm: 120}),
        new MenuItem({pos: new Vector(70, 530), tempo: "Presto", bpm: 168}),
        new MenuItem({pos: new Vector(70, 650), tempo: "Prestissimo", bpm: 208}),
        new MenuItem({
            pos: new Vector(70, 770),
            tempo: "Hyper-Prestississississimo\nExtreme to the Max!",
            bpm: 350,
            textSize: 32
        })
    ];

    public constructor(private readonly game: Game) {
        super(game.engine);

        const background = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero
        });
        background.addDrawing(resources.titleBackground);
        this.add(background);

        this.items.forEach(item => this.add(item));

        this.items[0].locked = false;
        this.items[0].selected = true;
    }

    public onActivate(): void {
        this.game.music.kill();
        this.add(this.game.music);
        this.game.music.play();
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.game.engine.input.keyboard.wasPressed(13 /*Enter*/)) {
            resources.menuSelect.play()
                .then(() => void 0,
                    reason => console.error("", reason));

            const selectedItem = this.items[this.selectedIndex];
            this.game.tempo = selectedItem.tempo;
            this.game.bpm = selectedItem.bpm;

            this.game.engine.goToScene("performance");
        } else {
            const itemChange =
                this.game.engine.input.keyboard.wasPressed(Input.Keys.Up) ? -1 :
                    this.game.engine.input.keyboard.wasPressed(Input.Keys.Down) ? 1 :
                        0;

            if (itemChange !== 0) {
                this.items[this.selectedIndex].selected = false;
                resources.menuBlip.play()
                    .then(() => void 0,
                        reason => console.error("", reason));
                this.selectedIndex += itemChange;

                if (this.selectedIndex < 0) {
                    this.selectedIndex = 0;
                }

                if (this.selectedIndex >= this.items.length) {
                    this.selectedIndex = this.items.length - 1;
                }

                const selectedItem = this.items[this.selectedIndex];

                selectedItem.selected = true;

                if (selectedItem.body.collider.bounds.bottom > this.camera.viewport.bottom) {
                    this.camera.move(
                        new Vector(this.game.width * 0.5, selectedItem.pos.y + 150 - this.game.height * 0.5),
                        20 / 60 * 1000,
                        EasingFunctions.EaseOutCubic)
                        .then(() => void 0,
                            reason => console.error("", reason));
                } else if (selectedItem.body.collider.bounds.top < this.camera.viewport.top) {
                    this.camera.move(
                        new Vector(this.game.width * 0.5, selectedItem.pos.y - 50 + this.game.height * 0.5),
                        20 / 60 * 1000,
                        EasingFunctions.EaseOutCubic)
                        .then(() => void 0,
                            reason => console.error("", reason));
                }
            }
        }
    }
}