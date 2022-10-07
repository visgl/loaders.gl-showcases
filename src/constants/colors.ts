/**
 * Color naming rules
 * https://medium.com/@stefanmorris/proper-naming-of-color-variables-683264fec0f4
 */

import { COLOR } from "../types";

export const color_brand_primary = "#232430";
export const color_brand_secondary = "#60C2A4";
export const color_brand_tertiary = "#605DEC";
export const color_brand_quaternary = "#9EA2AE";
export const color_brand_quinary = "#30B18A";

export const dim_brand_tertinary = "#4744D3";

export const color_canvas_primary = "#0E111A";
export const color_canvas_secondary = "#FBFCFE";
export const color_canvas_primary_inverted = "#FFFFFF";
export const color_canvas_secondary_inverted = "#9EA2AE";

export const hilite_canvas_primary = "#393A45";
export const hilite_canvas_secondary = "#DCDEE3";

export const color_accent_primary = "#F95050";
export const color_accent_secondary = "#33A985";

export const dim_canvas_primary = "#616678";
export const dim_canvas_secondary = "#CDCFD6";

export const COLORS_BY_ATTRIBUTE: {
  min: {
    hex: string;
    rgba: COLOR;
  };
  max: {
    hex: string;
    rgba: COLOR;
  };
} = {
  min: {
    hex: "#9292FC",
    rgba: [146, 146, 252, 255],
  },
  max: {
    hex: "#2C2CAF",
    rgba: [44, 44, 175, 255],
  },
};
