import {values} from "@softwareventures/dictionary";
import {DisplayMode, Engine, Loader} from "excalibur";
import resources from "./resources";
import Title from "./title/title";

export default class Game {
    public readonly width = 640;
    public readonly height = 480;

    public active = false;

    public readonly engine = new Engine({
        width: this.width,
        height: this.height,
        displayMode: DisplayMode.Fixed,
        suppressPlayButton: true
    });

    constructor() {
        this.engine.canvas.style.position = "absolute";
    }

    public start(): void {
        const loader = new Loader(values(resources));

        this.engine.start(loader)
            .then(() => {
                this.engine.addScene("title", new Title(this));
                this.engine.goToScene("title");
            }, reason => console.error("", reason));
    }
}