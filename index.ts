import domready from "domready";
import Game from "./game.js";
import pkg from "./package.json";

console.log("Super Metronome Hero v" + pkg.version);

domready(() => {
    const game = new Game();
    const engine = game.engine;

    engine.screen.canvas.style.position = "absolute";

    // Work around Firefox not supporting image-rendering: pixelated
    // See https://github.com/excaliburjs/Excalibur/issues/1676
    if (engine.canvas.style.imageRendering === "") {
        engine.canvas.style.imageRendering = "crisp-edges";
    }

    const scale = (): void => {
        const scaleFactor = Math.floor(
            Math.min(window.innerWidth / game.width, window.innerHeight / game.height)
        );

        const scaledWidth = game.width * scaleFactor;
        const scaledHeight = game.height * scaleFactor;

        engine.screen.viewport = {width: scaledWidth, height: scaledHeight};
        engine.screen.applyResolutionAndViewport();

        engine.screen.canvas.tabIndex = 0;
        engine.screen.canvas.style.left = `${Math.floor(
            (window.innerWidth - scaledWidth) * 0.5
        )}px`;
        engine.screen.canvas.style.top = `${Math.floor(
            (window.innerHeight - scaledHeight) * 0.5
        )}px`;
    };

    const onKey = (event: KeyboardEvent): void => {
        engine.screen.canvas.focus();

        switch (event.code) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
            case "KeyX":
            case "Space":
            case "Enter":
            case "NumpadEnter":
                event.preventDefault();
        }
    };

    const onMouseButton = (): void => {
        engine.screen.canvas.focus();
    };

    let pointerTimeout: number | null = null;

    const onMouseMove = (): void => {
        showPointer();

        if (pointerTimeout != null) {
            clearTimeout(pointerTimeout);
        }

        pointerTimeout = window.setTimeout(() => {
            if (game.active) {
                hidePointer();
            }
        }, 500);
    };

    const onFocus = (): void => {
        hidePointer();
        game.active = true;
    };

    const onBlur = (): void => {
        showPointer();
        game.active = false;
    };

    const hidePointer = (): void => {
        engine.canvas.style.cursor = "none";
    };

    const showPointer = (): void => {
        engine.canvas.style.cursor = "auto";
    };

    scale();

    window.addEventListener("resize", scale);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keypress", onKey);
    window.addEventListener("keyup", onKey);
    engine.canvas.addEventListener("mousedown", onMouseButton);
    engine.canvas.addEventListener("click", onMouseButton);
    engine.canvas.addEventListener("mouseup", onMouseButton);
    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("focus", onFocus, true);
    window.addEventListener("blur", onBlur, true);

    game.start();
});
