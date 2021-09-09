import type {LabelOptions} from "@dcgw/excalibur-extended-label";
import {BaseAlign, Color} from "excalibur";

export const defaultLabelOptions: LabelOptions = {
    fontFamily: "Strait",
    fontSize: 48,
    baseAlign: BaseAlign.Top,
    color: Color.White,
    outlineColor: Color.fromRGB(0, 0, 0, 0.5),
    outlineWidth: 1,
    shadowColor: Color.Black,
    shadowBlurRadius: 2
};
