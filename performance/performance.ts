import type {Engine, Sound} from "excalibur";
import {Actor, Color, EasingFunctions, Scene, TextAlign, Vector} from "excalibur";
import type Game from "../game.js";
import resources from "../resources.js";
import Timer from "../metronome/timer.js";
import {textActor} from "../text-actor.js";
import {ColorLerp} from "./color.js";
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
    private showInstructions = true;
    private readonly timer: Timer;
    private score = 0;
    private multiplier = 0;
    private missedBeats = 0;
    private introBeat = 0;
    private beats = 0;
    private state = State.intro;
    private time = 0;
    private finalStars = 0;

    private readonly tempoText = textActor({
        pos: new Vector(22, 24),
        color: Color.fromHex("eeeeee"),
        fontSize: 36
    });
    private readonly bpmText = textActor({
        pos: new Vector(22, 58),
        color: Color.fromHex("eeeeee"),
        fontSize: 24
    });
    private readonly scoreText = textActor({
        pos: new Vector(618, 15),
        color: Color.fromHex("eeeeee"),
        fontSize: 48,
        textAlign: TextAlign.Right
    });
    private readonly multiplierText = textActor({
        pos: new Vector(618, 58),
        fontSize: 28,
        textAlign: TextAlign.Right
    });
    private readonly multiplierMissColorLerp = new ColorLerp(Color.fromHex("c41b18"), Color.White);
    private readonly multiplierMissTween = new Tween(
        (10 / 60) * 1000,
        f => (this.multiplierText[0].color = this.multiplierMissColorLerp.lerp(f))
    );
    private readonly multiplierPerfectColorLerp = new ColorLerp(
        Color.fromHex("d3cd08"),
        Color.White
    );
    private readonly multiplierPerfectTween = new Tween(
        (10 / 60) * 1000,
        f => (this.multiplierText[0].color = this.multiplierPerfectColorLerp.lerp(f))
    );
    private readonly messageText = textActor({
        text: "Press ANY key in time with the pendulum",
        pos: new Vector(320, 167),
        color: Color.fromHex("eeeeee"),
        fontSize: 72,
        textAlign: TextAlign.Center
    });
    private readonly messageFadeIn = new Tween(
        (20 / 60) * 1000,
        f => (this.messageText[0].opacity = f)
    );
    private readonly messageFadeOut = new Tween(
        (20 / 60) * 1000,
        f => (this.messageText[0].opacity = 1 - f)
    );
    private readonly arm = new Arm();
    private readonly star1Blank = new Actor({pos: new Vector(180, 300), width: 158, height: 152});
    private readonly star2Blank = new Actor({pos: new Vector(320, 300), width: 158, height: 152});
    private readonly star3Blank = new Actor({pos: new Vector(460, 300), width: 158, height: 152});
    private readonly star1 = new Actor({pos: new Vector(180, 300), width: 120, height: 115});
    private readonly star2 = new Actor({pos: new Vector(320, 300), width: 120, height: 115});
    private readonly star3 = new Actor({pos: new Vector(460, 300), width: 120, height: 115});
    private readonly starBlankFadeIn = new Tween((30 / 60) * 1000, f => {
        this.star1Blank.graphics.opacity = f;
        this.star2Blank.graphics.opacity = f;
        this.star3Blank.graphics.opacity = f;
    });
    private readonly star1FadeIn = new Tween(
        (10 / 60) * 1000,
        f => {
            this.star1.graphics.opacity = f;
            const scale = 0.6 + 0.4 * f;
            this.star1.scale = new Vector(scale, scale);
        },
        EasingFunctions.Linear,
        () => {
            if (this.finalStars > 1) {
                resources.performanceStar2.play().then(
                    () => {},
                    reason => void console.error("", reason)
                );
                this.star2FadeIn.play().catch(reason => void console.error("", reason));
            } else {
                this.transition(State.done);
            }
        }
    );
    private readonly star2FadeIn = new Tween(
        (10 / 60) * 1000,
        f => {
            this.star2.graphics.opacity = f;
            const scale = 0.6 + 0.4 * f;
            this.star2.scale = new Vector(scale, scale);
        },
        EasingFunctions.Linear,
        () => {
            if (this.finalStars > 2) {
                resources.performanceStar3.play().then(
                    () => {},
                    reason => void console.error("", reason)
                );
                this.star3FadeIn.play().catch(reason => void console.error("", reason));
            } else {
                this.transition(State.done);
            }
        }
    );
    private readonly star3FadeIn = new Tween(
        (10 / 60) * 1000,
        f => {
            this.star3.graphics.opacity = f;
            const scale = 0.6 + 0.4 * f;
            this.star3.scale = new Vector(scale, scale);
        },
        EasingFunctions.Linear,
        () => {
            this.transition(State.done);
        }
    );
    private readonly instructionText = textActor({
        text: "Press ANY key in time with the pendulum",
        pos: new Vector(320, 370),
        color: Color.fromHex("eeeeee"),
        fontSize: 32,
        textAlign: TextAlign.Center,
        opacity: 0
    });
    private readonly instructionFadeIn = new Tween(
        (30 / 60) * 1000,
        f => (this.instructionText[0].opacity = f)
    );
    private readonly instructionFadeOut = new Tween(
        (30 / 60) * 1000,
        f => (this.instructionText[0].opacity = 1 - f)
    );

    private readonly countdown: readonly Sound[] = [
        resources.performanceOne,
        resources.performanceTwo,
        resources.performanceThree,
        resources.performanceFour
    ];

    public constructor(private readonly game: Game) {
        super();
        this.timer = new Timer(0);

        const background = new Actor({
            pos: Vector.Zero,
            width: 640,
            height: 480,
            anchor: Vector.Zero
        });
        background.graphics.add(resources.performanceBackground.toSprite());
        this.add(background);

        this.add(this.arm);

        const overlay = new Actor({
            pos: Vector.Zero,
            width: 640,
            height: 480,
            anchor: Vector.Zero
        });
        overlay.graphics.add(resources.performanceOverlay.toSprite());
        this.add(overlay);

        const vignette = new Actor({
            pos: Vector.Zero,
            width: 640,
            height: 480,
            anchor: Vector.Zero
        });
        vignette.graphics.add(resources.performanceVignette.toSprite());
        this.add(vignette);

        this.add(this.tempoText[1]);
        this.add(this.bpmText[1]);
        this.add(this.scoreText[1]);
        this.add(this.multiplierText[1]);
        this.add(this.multiplierMissTween);
        this.add(this.multiplierPerfectTween);
        this.add(this.messageText[1]);
        this.add(this.messageFadeIn);
        this.add(this.messageFadeOut);

        this.star1Blank.graphics.add(resources.performanceBigStarBlank.toSprite());
        this.add(this.star1Blank);
        this.star2Blank.graphics.add(resources.performanceBigStarBlank.toSprite());
        this.add(this.star2Blank);
        this.star3Blank.graphics.add(resources.performanceBigStarBlank.toSprite());
        this.add(this.star3Blank);
        this.star1.graphics.add(resources.performanceBigStar.toSprite());
        this.add(this.star1);
        this.star2.graphics.add(resources.performanceBigStar.toSprite());
        this.add(this.star2);
        this.star3.graphics.add(resources.performanceBigStar.toSprite());
        this.add(this.star3);

        this.add(this.starBlankFadeIn);
        this.add(this.star1FadeIn);
        this.add(this.star2FadeIn);
        this.add(this.star3FadeIn);

        this.add(this.instructionText[1]);
        this.add(this.instructionFadeIn);
        this.add(this.instructionFadeOut);
    }

    public override onActivate(): void {
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
        this.tempoText[0].text = this.game.tempo;
        this.bpmText[0].text = `${this.game.bpm}bpm`;
        this.beats = 16;
        this.state = State.intro;
        this.time = introDuration;

        this.star1Blank.graphics.opacity = 0;
        this.star2Blank.graphics.opacity = 0;
        this.star3Blank.graphics.opacity = 0;
        this.star1.graphics.opacity = 0;
        this.star2.graphics.opacity = 0;
        this.star3.graphics.opacity = 0;
        this.star1.scale = new Vector(0.6, 0.6);
        this.star2.scale = new Vector(0.6, 0.6);
        this.star3.scale = new Vector(0.6, 0.6);

        this.updateScoreAndMultiplierText();
        this.multiplierText[0].color = Color.White;

        this.messageText[0].text = "Ready?";
        this.messageText[0].opacity = 0;
        void this.messageFadeIn.play();

        resources.performanceReady.play().then(
            () => void 0,
            reason => void console.error("", reason)
        );
    }

    public override update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.timer.update(delta);

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
                        reason => void console.error("", reason)
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

                if (this.game.wasAnyKeyPressed()) {
                    if (this.showInstructions && this.instructionText[0].opacity === 1) {
                        void this.instructionFadeOut.play();
                        this.showInstructions = false;
                    }

                    const missed = this.timer.offBeatMs >= (4 / 60) * 1000;
                    if (missed) {
                        this.arm.miss();
                        this.multiplier = 0;
                        void this.multiplierMissTween.play();
                    } else {
                        this.arm.tickTock();
                        ++this.multiplier;
                        this.missedBeats = 0;
                    }

                    // What kind of hit did we register?
                    if (this.timer.offBeatMs < (1 / 60) * 1000) {
                        this.add(new Floater("Perfect!", Color.fromHex("d3cd08")));
                        this.multiplier += 4;
                        void this.multiplierPerfectTween.play();
                        resources.performanceChime.play().then(
                            () => void 0,
                            reason => void console.error("", reason)
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
                // TODO: should arm return to center?

                this.time -= delta;
                if (this.time <= 0) {
                    this.transition(State.result);
                }
                break;
            case State.done:
                if (this.game.wasAnyKeyPressed()) {
                    this.transition(State.return);
                }
                break;
        }
    }

    private updateScoreAndMultiplierText(): void {
        this.scoreText[0].text = String(this.score).padStart(6, "0");
        this.multiplierText[0].text = String(this.multiplier).padStart(3, "0");
    }

    private transition(state: State): void {
        this.state = state;

        switch (state) {
            case State.countIn:
                this.timer.start();

                if (this.showInstructions) {
                    void this.instructionFadeIn.play();
                }
                break;
            case State.play:
                void this.messageFadeOut.play();
                break;
            case State.outro:
                this.messageText[0].text =
                    this.missedBeats <= maxMissedBeats ? "Great!" : "You Suck";
                void this.messageFadeIn.play();

                this.starBlankFadeIn.play().catch(reason => void console.error("", reason));

                this.time = outroDuration;

                (this.missedBeats <= maxMissedBeats
                    ? resources.performanceCheer
                    : resources.performanceBoo
                )
                    .play()
                    .then(
                        () => void 0,
                        reason => void console.error("", reason)
                    );
                break;
            case State.result:
                this.calculateFinalStars();
                if (this.finalStars > 0) {
                    resources.performanceStar1.play().then(
                        () => {},
                        reason => void console.error("", reason)
                    );
                    this.star1FadeIn.play().catch(reason => void console.error("", reason));
                } else {
                    this.transition(State.done);
                }
                break;
            case State.return:
                this.game.stars = this.finalStars;
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
