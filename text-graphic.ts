import Text from "@dcgw/excalibur-text";
import {BaseAlign, Color, TextAlign, Vector} from "excalibur";

export interface TextOptions {
    readonly text?: string | undefined;
    readonly fontSize?: number | undefined;
    readonly textAlign?: TextAlign | undefined;
    readonly color?: Color | undefined;
    readonly opacity?: number | undefined;
    readonly outlineColor?: Color | undefined;
    readonly shadowBlurRadius?: number;
}

export function textGraphic(options: TextOptions): Text {
    return new Text({
        origin: Vector.Zero,
        text: options.text ?? "",
        fontFamily: "Strait",
        fontSize: options.fontSize ?? 48,
        textAlign: options.textAlign ?? TextAlign.Left,
        baseAlign: BaseAlign.Top,
        color: options.color ?? Color.White,
        outlineColor: options.outlineColor ?? Color.fromRGB(0, 0, 0, 0.5),
        outlineWidth: 1,
        shadowColor: Color.Black,
        shadowBlurRadius: options.shadowBlurRadius ?? 2,
        ...(options.opacity == null ? {} : {opacity: options.opacity})
    });
}
