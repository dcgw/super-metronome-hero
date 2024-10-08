import {notNull} from "@softwareventures/nullable";
import type {Engine} from "excalibur";
import {Actor, EasingFunctions, Input, Scene, Vector} from "excalibur";
import type Game from "../game.js";
import resources from "../resources.js";
import MenuItem from "./menu-item.js";

export default class Menu extends Scene {
    private selectedIndex = 0;

    private readonly background = new Actor({
        pos: Vector.Zero,
        anchor: Vector.Zero
    });

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
        super();

        this.background.graphics.add(resources.titleBackground.toSprite());
        this.add(this.background);

        this.items.forEach(item => void this.add(item));

        notNull(this.items[0]).locked = false;
        notNull(this.items[0]).selected = true;
    }

    public override onActivate(): void {
        this.game.music.kill();
        this.add(this.game.music);
        this.game.music.play();

        const selectedItem = notNull(this.items[this.selectedIndex]);
        if (this.game.stars > selectedItem.stars) {
            selectedItem.stars = this.game.stars;

            const nextItem = this.items[this.selectedIndex + 1];
            if (this.game.stars > 0 && nextItem?.locked === true) {
                nextItem.locked = false;
            }
        }
    }

    public override update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.game.engine.input.keyboard.wasPressed("Enter" as Input.Keys)) {
            resources.menuSelect.play().then(
                () => void 0,
                reason => void console.error("", reason)
            );

            const selectedItem = notNull(this.items[this.selectedIndex]);
            if (!selectedItem.locked) {
                this.game.tempo = selectedItem.tempo;
                this.game.bpm = selectedItem.bpm;

                this.game.engine.goToScene("performance");
            }
        } else {
            const itemChange = this.game.engine.input.keyboard.wasPressed(Input.Keys.Up)
                ? -1
                : this.game.engine.input.keyboard.wasPressed(Input.Keys.Down)
                  ? 1
                  : 0;

            if (itemChange !== 0) {
                notNull(this.items[this.selectedIndex]).selected = false;
                resources.menuBlip.play().then(
                    () => void 0,
                    reason => void console.error("", reason)
                );
                this.selectedIndex += itemChange;

                if (this.selectedIndex < 0) {
                    this.selectedIndex = 0;
                }

                if (this.selectedIndex >= this.items.length) {
                    this.selectedIndex = this.items.length - 1;
                }

                const selectedItem = notNull(this.items[this.selectedIndex]);

                selectedItem.selected = true;

                if (selectedItem.collider.bounds.bottom > this.camera.viewport.bottom) {
                    this.camera
                        .move(
                            new Vector(
                                this.game.width * 0.5,
                                selectedItem.pos.y + 150 - this.game.height * 0.5
                            ),
                            (20 / 60) * 1000,
                            EasingFunctions.EaseOutCubic
                        )
                        .then(
                            () => void 0,
                            reason => void console.error("", reason)
                        );
                } else if (selectedItem.collider.bounds.top < this.camera.viewport.top) {
                    this.camera
                        .move(
                            new Vector(
                                this.game.width * 0.5,
                                selectedItem.pos.y - 50 + this.game.height * 0.5
                            ),
                            (20 / 60) * 1000,
                            EasingFunctions.EaseOutCubic
                        )
                        .then(
                            () => void 0,
                            reason => void console.error("", reason)
                        );
                }
            }
        }

        this.background.pos.y = this.camera.y - this.game.height * 0.5;
    }
}
