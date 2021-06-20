import Label from "@dcgw/excalibur-extended-label";
import {
    Actor,
    Color,
    EasingFunctions,
    Engine,
    Input,
    Scene,
    Sound,
    Sprite,
    TextAlign,
    Vector
} from "excalibur";
import {defaultLabelOptions} from "../defaults.js";
import Game from "../game.js";
import resources from "../resources.js";
import Timer from "../metronome/timer.js";
import Floater from "./floater.js";
import Tween from "./tween.js";
import Arm from "./arm.js";

const introDuration = (30 / 60) * 1000;
const outroDuration = (50 / 60) * 1000;
const scoreThreshold3Star = 6000;
const scoreThreshold2Star = 2000;
const scoreThreshold1Star = 1;
const baseScore = 7;
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
    private score = 0;
    private multiplier = 0;
    private missedBeats = 0;
    private introBeat = 0;
    private beats = 0;
    private state = State.intro;
    private time = 0;
    private finalStars = 0;

    private readonly tempoText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(22, 24),
        color: Color.fromHex("eeeeee"),
        fontSize: 36
    });
    private readonly bpmText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(22, 58),
        color: Color.fromHex("eeeeee"),
        fontSize: 24
    });
    private readonly scoreText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(618, 15),
        color: Color.fromHex("eeeeee"),
        fontSize: 48,
        textAlign: TextAlign.Right
    });
    private readonly multiplierText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(618, 58),
        color: Color.fromHex("eeeeee"),
        fontSize: 28,
        textAlign: TextAlign.Right
    });
    private readonly messageText = new Label({
        ...defaultLabelOptions,
        pos: new Vector(320, 167),
        color: Color.fromHex("eeeeee"),
        fontSize: 72,
        textAlign: TextAlign.Center
    });
    private readonly arm = new Arm();
    private readonly star1Blank = new Actor({pos: new Vector(180, 300), width: 158, height: 152});
    private readonly star2Blank = new Actor({pos: new Vector(320, 300), width: 158, height: 152});
    private readonly star3Blank = new Actor({pos: new Vector(460, 300), width: 158, height: 152});
    private readonly star1 = new Actor({pos: new Vector(180, 300), width: 120, height: 115});
    private readonly star2 = new Actor({pos: new Vector(320, 300), width: 120, height: 115});
    private readonly star3 = new Actor({pos: new Vector(460, 300), width: 120, height: 115});

    private readonly starBlankFadeIn = new Tween((30 / 60) * 1000, f => {
        // FIXME Annoying hack, see https://github.com/excaliburjs/Excalibur/issues/874#issuecomment-814557137
        this.star1Blank.visible = true;
        this.star2Blank.visible = true;
        this.star3Blank.visible = true;
        this.star1Blank.opacity = f;
        this.star2Blank.opacity = f;
        this.star3Blank.opacity = f;
    });

    private readonly star1FadeIn = new Tween(
        (10 / 60) * 1000,
        f => {
            // FIXME Annoying hack, see https://github.com/excaliburjs/Excalibur/issues/874#issuecomment-814557137
            this.star1.visible = true;
            this.star1.opacity = f;
            const scale = 0.6 + 0.4 * f;
            this.star1.scale = new Vector(scale, scale);
        },
        EasingFunctions.Linear,
        () => {
            if (this.finalStars > 1) {
                resources.performanceStar2.play().then(
                    () => {},
                    reason => console.error("", reason)
                );
                this.star2FadeIn.play().catch(reason => console.error("", reason));
            } else {
                this.transition(State.done);
            }
        }
    );

    private readonly star2FadeIn = new Tween(
        (10 / 60) * 1000,
        f => {
            // FIXME Annoying hack, see https://github.com/excaliburjs/Excalibur/issues/874#issuecomment-814557137
            this.star2.visible = true;
            this.star2.opacity = f;
            const scale = 0.6 + 0.4 * f;
            this.star2.scale = new Vector(scale, scale);
        },
        EasingFunctions.Linear,
        () => {
            if (this.finalStars > 2) {
                resources.performanceStar3.play().then(
                    () => {},
                    reason => console.error("", reason)
                );
                this.star3FadeIn.play().catch(reason => console.error("", reason));
            } else {
                this.transition(State.done);
            }
        }
    );

    private readonly star3FadeIn = new Tween(
        (10 / 60) * 1000,
        f => {
            // FIXME Annoying hack, see https://github.com/excaliburjs/Excalibur/issues/874#issuecomment-814557137
            this.star3.visible = true;
            this.star3.opacity = f;
            const scale = 0.6 + 0.4 * f;
            this.star3.scale = new Vector(scale, scale);
        },
        EasingFunctions.Linear,
        () => {
            this.transition(State.done);
        }
    );

    private readonly countdown: readonly Sound[] = [
        resources.performanceOne,
        resources.performanceTwo,
        resources.performanceThree,
        resources.performanceFour
    ];

    public constructor(private readonly game: Game) {
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

        this.add(this.tempoText);
        this.add(this.bpmText);
        this.add(this.scoreText);
        this.add(this.multiplierText);
        this.add(this.messageText);

        this.star1Blank.addDrawing(new Sprite(resources.performanceBigStarBlank, 0, 0, 158, 152));
        this.add(this.star1Blank);
        this.star2Blank.addDrawing(new Sprite(resources.performanceBigStarBlank, 0, 0, 158, 152));
        this.add(this.star2Blank);
        this.star3Blank.addDrawing(new Sprite(resources.performanceBigStarBlank, 0, 0, 158, 152));
        this.add(this.star3Blank);
        this.star1.addDrawing(new Sprite(resources.performanceBigStar, 0, 0, 120, 115));
        this.add(this.star1);
        this.star2.addDrawing(new Sprite(resources.performanceBigStar, 0, 0, 120, 115));
        this.add(this.star2);
        this.star3.addDrawing(new Sprite(resources.performanceBigStar, 0, 0, 120, 115));
        this.add(this.star3);

        this.add(this.starBlankFadeIn);
        this.add(this.star1FadeIn);
        this.add(this.star2FadeIn);
        this.add(this.star3FadeIn);

        // TODO: instructionText
    }

    public onActivate(): void {
        this.game.music.kill();
        this.add(this.game.music);
        this.game.music.stop();

        this.score = 0;
        this.multiplier = 0;
        this.game.stars = 0;
        this.missedBeats = 0;
        this.introBeat = 0;
        this.timer.reset(this.game.bpm);
        this.arm.reset();
        this.tempoText.text = this.game.tempo;
        this.bpmText.text = `${this.game.bpm}bpm`;
        this.beats = 16;
        this.state = State.intro;
        this.time = introDuration;

        this.star1Blank.opacity = 0;
        this.star2Blank.opacity = 0;
        this.star3Blank.opacity = 0;
        this.star1.opacity = 0;
        this.star2.opacity = 0;
        this.star3.opacity = 0;
        this.star1.scale = new Vector(0.6, 0.6);
        this.star2.scale = new Vector(0.6, 0.6);
        this.star3.scale = new Vector(0.6, 0.6);

        this.updateScoreAndMultiplierText();

        this.messageText.text = "Ready?";

        // TODO: fade message

        resources.performanceReady.play().then(
            () => void 0,
            reason => console.error("", reason)
        );
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
                    this.countdown[this.introBeat]?.play().then(
                        () => void 0,
                        reason => console.error("", reason)
                    );
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
                    --this.beats;
                }

                // TODO: should accept any key
                if (this.game.engine.input.keyboard.wasPressed(Input.Keys.Space)) {
                    // TODO: Fade instructions

                    const missed = this.timer.offBeatMs >= (4 / 60) * 1000;
                    if (missed) {
                        this.arm.miss();
                        this.multiplier = 0;
                        // TODO: Update and fade multiplier text
                    } else {
                        this.arm.tickTock();
                        ++this.multiplier;
                        // TODO: Update multiplier text
                        this.missedBeats = 0;
                    }

                    // What kind of hit did we register?
                    if (this.timer.offBeatMs < (1 / 60) * 1000) {
                        this.add(new Floater("Perfect!", Color.fromHex("d3cd08")));
                        this.multiplier += 4;
                        // TODO: Update and fade multiplier text
                        resources.performanceChime.play().then(
                            () => void 0,
                            reason => console.error("", reason)
                        );
                    } else if (this.timer.offBeatMs < (3 / 60) * 1000) {
                        this.add(new Floater("Good", Color.fromHex("0bd308")));
                    } else if (this.timer.offBeatMs < (4 / 60) * 1000) {
                        // Do nothing
                    } else if (this.timer.offBeatMs < (7 / 60) * 1000) {
                        this.add(new Floater("Miss", Color.fromHex("5368b2")));
                    } else if (this.timer.offBeatMs < (8 / 60) * 1000) {
                        // Do nothing
                        // TODO: Is this really intended?
                    } else if (this.timer.offBeatMs < (10 / 60) * 1000) {
                        this.add(new Floater("Poor", Color.fromHex("c41b18")));
                    } else {
                        this.add(new Floater("Awful!", Color.fromHex("c41b18")));
                    }

                    // Score some points if we hit.
                    if (!missed) {
                        const factor = Math.max(
                            0,
                            4 - Math.floor((this.timer.offBeatMs / 1000) * 60)
                        );
                        this.score += factor * this.multiplier * baseScore;
                    }
                }

                this.updateScoreAndMultiplierText();

                // Check to see if we should transition out of the play state.
                if (this.beats < 0 || this.missedBeats > maxMissedBeats) {
                    this.transition(State.outro);
                }
                break;
            case State.outro:
                // TODO: arm should return to center.

                this.time -= delta;
                if (this.time <= 0) {
                    this.transition(State.result);
                }
                break;
            case State.done:
                // TODO: should accept any key
                if (this.game.engine.input.keyboard.wasPressed(Input.Keys.Space)) {
                    this.transition(State.return);
                }
                break;
        }
    }

    private updateScoreAndMultiplierText(): void {
        this.scoreText.text = String(this.score).padStart(6, "0");
        this.multiplierText.text = String(this.multiplier).padStart(3, "0");
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
                this.messageText.text = this.missedBeats <= maxMissedBeats ? "Great!" : "You Suck";

                // TODO: fade message text

                this.starBlankFadeIn.play().catch(reason => console.error("", reason));

                this.time = outroDuration;

                (this.missedBeats <= maxMissedBeats
                    ? resources.performanceCheer
                    : resources.performanceBoo
                )
                    .play()
                    .then(
                        () => void 0,
                        reason => console.error("", reason)
                    );
                break;
            case State.result:
                this.calculateFinalStars();
                if (this.finalStars > 0) {
                    resources.performanceStar1.play().then(
                        () => {},
                        reason => console.error("", reason)
                    );
                    this.star1FadeIn.play().catch(reason => console.error("", reason));
                } else {
                    this.transition(State.done);
                }
                break;
            case State.return:
                this.game.engine.goToScene("menu");
                break;
        }
    }

    private calculateFinalStars(): void {
        if (this.missedBeats > maxMissedBeats) {
            this.finalStars = 0;
        } else if (this.score > scoreThreshold3Star) {
            // TODO Really? Not >=?
            this.finalStars = 3;
        } else if (this.score > scoreThreshold2Star) {
            // TODO Really? Not >=?
            this.finalStars = 2;
        } else if (this.score > scoreThreshold1Star) {
            // TODO Really? Not >=?
            this.finalStars = 1;
        } else {
            this.finalStars = 0;
        }
    }
}
