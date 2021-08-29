export enum TextAlign {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export enum VerticalTextAlign {
  TOP = "top",
  BOTTOM = "bottom",
  CENTER = "center",
}

export interface TextConfig {
  textAlign?: TextAlign;
  verticalTextAlign?: VerticalTextAlign;
}
