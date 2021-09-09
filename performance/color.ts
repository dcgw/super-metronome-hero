import {Color} from "excalibur";

export class ColorLerp {
    private readonly from: Color;
    private readonly to: Color;
    private readonly fromLinear: LinearColor;
    private readonly toLinear: LinearColor;

    public constructor(from: Color, to: Color) {
        this.from = from.clone();
        this.to = to.clone();
        this.fromLinear = gammaColorToLinear(from);
        this.toLinear = gammaColorToLinear(to);
    }

    public lerp(factor: number): Color {
        if (factor <= 0 || !isFinite(factor)) {
            return this.from;
        } else if (factor >= 1) {
            return this.to;
        } else {
            return linearColorToGamma({
                r: this.fromLinear.r * (1 - factor) + this.toLinear.r * factor,
                g: this.fromLinear.g * (1 - factor) + this.toLinear.g * factor,
                b: this.fromLinear.b * (1 - factor) + this.toLinear.b * factor
            });
        }
    }
}

export interface LinearColor {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}

export function gammaColorToLinear(gamma: Color): LinearColor {
    return {
        r: gammaColorComponentToLinear(gamma.r),
        g: gammaColorComponentToLinear(gamma.g),
        b: gammaColorComponentToLinear(gamma.b)
    };
}

export function linearColorToGamma(linear: LinearColor): Color {
    return Color.fromRGB(
        linearColorComponentToGamma(linear.r),
        linearColorComponentToGamma(linear.g),
        linearColorComponentToGamma(linear.b)
    );
}

export function gammaColorComponentToLinear(gamma: number): number {
    return (gamma / 255) ** 2.2;
}

export function linearColorComponentToGamma(linear: number): number {
    return linear ** (1 / 2.2) * 255;
}
