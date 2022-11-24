import {lookupFontStyle, lookupFontWeight} from "@dcgw/excalibur-text/style.js";
import {FontStyle} from "excalibur";
import type {Loadable} from "excalibur";

export class FontLoader implements Loadable<void> {
    public data = undefined;
    private readonly font: string;

    public constructor (fontFamily: string, fontSize: number, fontStyle = FontStyle.Normal, bold = false) {
        this.font = `${lookupFontStyle(fontStyle)} ${lookupFontWeight(bold)} ${fontSize}px ${fontFamily}`;
    }

    public async load(): Promise<void> {
        while (!this.isLoaded()) {
            await document.fonts.load(this.font);
        }
    }

    public isLoaded(): boolean {
        return document.fonts.check(this.font);
    }
}
