import domready = require("domready");
import Game from "./game";
import {version} from "./package.json";

console.log("Super Metronome Hero v" + version);

domready(() => {
    const game = new Game();
    const engine = game.engine;

    engine.canvas.style.position = "absolute";
    engine.canvas.style.imageRendering = "pixelated";

    const scale = (): void => {
        const scaleFactor = Math.floor(Math.min(
            window.innerWidth / game.width,
            window.innerHeight / game.height
        ));

        const scaledWidth = game.width * scaleFactor;
        const scaledHeight = game.height * scaleFactor;

        engine.canvas.tabIndex = 0;
        engine.canvas.style.left = `${Math.floor((window.innerWidth - scaledWidth) * 0.5)}px`;
        engine.canvas.style.top = `${Math.floor((window.innerHeight - scaledHeight) * 0.5)}px`;
        engine.canvas.style.width = `${scaledWidth}px`;
        engine.canvas.style.height = `${scaledHeight}px`;
    };

    const onKey = (event: KeyboardEvent): void => {
        engine.canvas.focus();

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
        engine.canvas.focus();
    };

    let pointerTimeout = 0;

    const onMouseMove = (): void => {
        showPointer();

        if (pointerTimeout) {
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