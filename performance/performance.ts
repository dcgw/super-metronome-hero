import {Actor, Engine, Input, Scene, Sound, Vector} from "excalibur";
import Game from "../game";
import resources from "../resources";
import Timer from "../timer";
import Arm from "./arm";

const introDuration = 30 / 60 * 1000;
const outroDuration = 50 / 60 * 1000;
// const baseScore = 7;
const maxMissedBeats = 4;

enum State {
    intro = "intro",
    countIn = "count-in",
    play = "play",
    outro = "outro",
    result = "result",
    done = "done",
    return = "return"
}

export class Performance extends Scene {
    private timer: Timer;
    // private score = 0;
    // private multiplier = 0;
    private missedBeats = 0;
    private introBeat = 0;
    // private beats = 0;
    private state = State.intro;
    private time = 0;

    private readonly arm = new Arm();

    private readonly countdown: ReadonlyArray<Sound> = [
        resources.performanceOne, resources.performanceTwo,
        resources.performanceThree, resources.performanceFour
    ];

    constructor(private readonly game: Game) {
        super(game.engine);
        this.timer = new Timer(0);

        const background = new Actor({
            pos: Vector.Zero,
            width: 640,
            height: 480,
            anchor: Vector.Zero
        });
        background.addDrawing(resources.performanceBackground);
        this.add(background);

        this.add(this.arm);

        const overlay = new Actor({
            pos: Vector.Zero,
            width: 640,
            height: 480,
            anchor: Vector.Zero
        });
        overlay.addDrawing(resources.performanceOverlay);
        this.add(overlay);

        const vignette = new Actor({
            pos: Vector.Zero,
            width: 640,
            height: 480,
            anchor: Vector.Zero
        });
        vignette.addDrawing(resources.performanceVignette);
        this.add(vignette);

        // TODO: tempoText, bpmText, scoreText, multiplierText, messageText

        // TODO: stars

        // TODO: instructionText
    }

    public onActivate(): void {
        this.game.music.kill();
        this.add(this.game.music);
        this.game.music.stop();

        // this.score = 0;
        // this.multiplier = 0;
        this.game.stars = 0;
        this.missedBeats = 0;
        this.introBeat = 0;
        this.timer.reset(this.game.bpm);
        this.arm.reset();
        // TODO: set tempo text
        // TODO: set bpm text
        // this.beats = 16;
        this.state = State.intro;
        this.time = introDuration;

        // TODO: set alpha and scale for stars

        // TODO: set message text

        // TODO: fade message

        resources.performanceReady.play()
            .then(() => void 0,
                reason => console.error("", reason));
    }


    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.timer.update(delta);

        // TODO: Set multiplier text colour

        switch (this.state) {
            case State.intro:
                // Pause a bit before starting
                this.time -= delta;
                if (this.time <= 0) {
                    this.transition(State.countIn);
                }
                break;
            case State.countIn:
                if (this.timer.isBeat) {
                    this.countdown[this.introBeat].play()
                        .then(() => void 0,
                            reason => console.error("", reason));
                    ++this.introBeat;

                    if (this.introBeat >= 4) {
                        this.transition(State.play);
                    }
                }
                break;
            case State.play:
                this.arm.beat(this.timer.beat);

                if (this.timer.isOffBeat) {
                    ++this.missedBeats;
                    // --this.beats;
                }

                // TODO: should accept any key
                if (this.game.engine.input.keyboard.wasPressed(Input.Keys.Space)) {
                    // TODO: Fade instructions

                    const missed = this.timer.offBeatMs >= 4 / 60 * 1000;
                    if (missed) {
                        this.arm.miss();
                        // this.multiplier = 0;
                        // TODO: Update and fade multiplier text
                    } else {
                        this.arm.tickTock();
                        // ++this.multiplier;
                        // TODO: Update multiplier text
                        this.missedBeats = 0;
                    }

                    // What kind of hit did we register?
                    if (this.timer.offBeatMs < 1 / 60 * 1000) {
                        // TODO: Float "Perfect!"
                        // this.multiplier += 4;
                        // TODO: Update and fade multiplier text
                        // TODO: Play chime
                    } else if (this.timer.offBeatMs < 3 / 60 * 1000) {
                        // TODO: Float "Good"
                    } else if (this.timer.offBeatMs < 4 / 60 * 1000) {
                        // Do nothing
                    } else if (this.timer.offBeatMs < 7 / 60 * 1000) {
                        // TODO: Float "Miss"
                    } else if (this.timer.offBeatMs < 8 / 60 * 1000) {
                        // Do nothing
                        // TODO: Is this really intended?
                    } else if (this.timer.offBeatMs < 10 / 60 * 1000) {
                        // TODO: Float "Poor"
                    } else {
                        // TODO: Float "Awful!"
                    }

                    // Score some points if we hit.
                    if (!missed) {
                        // const factor = Math.max(0, 4 - Math.floor(this.timer.offBeatMs / 1000 * 60));
                        // this.score += factor * this.multiplier * baseScore;
                    }
                }

                // TODO
                break;
            case State.outro:
                // TODO
                break;
            case State.done:
                // TODO
                break;
        }
    }

    private transition(state: State): void {
        this.state = state;

        switch (state) {
            case State.countIn:
                this.timer.start();
                // TODO: show instructions
                break;
            case State.play:
                // TODO: fade message text
                break;
            case State.outro:
                // TODO: set message text
                // TODO: display stars

                this.time = outroDuration;

                ((this.missedBeats <= maxMissedBeats) ? resources.performanceCheer : resources.performanceBoo)
                    .play()
                    .then(() => void 0,
                        reason => console.error("", reason));
                break;
            case State.result:
                // TODO
                break;
            case State.return:
                this.game.engine.goToScene("menu");
                break;
        }
    }
}