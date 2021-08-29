import { GUIColor } from "./gui-color";

export interface PaneConfig {
  width: number;
  height: number;
  x: number;
  y: number;
  color?: GUIColor;
  backgroundColor?: GUIColor;
}
