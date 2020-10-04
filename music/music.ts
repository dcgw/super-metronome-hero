import {Actor, Engine} from "excalibur";
import resources from "../resources";

const fadeTime = (30 / 60) * 1000;

resources.music.loop = true;

export default class Music extends Actor {
    private playing = false;
    private time = 0;

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.playing && resources.music.volume < 1) {
            this.time += delta;
            resources.music.volume = Math.min(this.time / fadeTime, 1);
        } else if (!this.playing && resources.music.volume > 0) {
            this.time += delta;
            resources.music.volume = Math.max(1 - this.time / fadeTime, 0);
        }
    }

    public play(): void {
        if (!resources.music.isPlaying()) {
            this.playing = true;
            resources.music.play().then(
                () => void 0,
                reason => console.error("", reason)
            );
        } else if (!this.playing) {
            this.time = 0;
            this.playing = true;
        }
    }

    public stop(): void {
        if (this.playing) {
            this.time = 0;
            this.playing = false;
        }
    }
}
