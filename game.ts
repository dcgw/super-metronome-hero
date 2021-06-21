import {values} from "@softwareventures/dictionary";
import {DisplayMode, Engine, Loader} from "excalibur";
import Menu from "./menu/menu.js";
import Music from "./music/music.js";
import {Performance} from "./performance/performance.js";
import resources from "./resources.js";
import Title from "./title/title.js";

export default class Game {
    public readonly width = 640;
    public readonly height = 480;

    public readonly music = new Music();

    public active = false;
    public tempo = "";
    public bpm = 0;
    public stars = 0;

    public readonly engine = new Engine({
        viewport: {width: this.width, height: this.height},
        resolution: {width: this.width, height: this.height},
        displayMode: DisplayMode.Fixed,
        antialiasing: false,
        suppressHiDPIScaling: true,
        suppressPlayButton: true
    });

    private anyKeyPressed = false;

    public start(): void {
        const loader = new Loader(values(resources));

        this.engine.start(loader).then(
            () => {
                this.engine.input.keyboard.on("press", () => (this.anyKeyPressed = true));
                this.engine.on("postframe", () => (this.anyKeyPressed = false));

                this.engine.addScene("title", new Title(this));
                this.engine.addScene("menu", new Menu(this));
                this.engine.addScene("performance", new Performance(this));
                this.engine.goToScene("title");
            },
            reason => console.error("", reason)
        );
    }

    public wasAnyKeyPressed(): boolean {
        return this.anyKeyPressed;
    }
}
