import { Destructable } from "./destructable";
import { GUIColor } from "./gui-color";

export interface Pane extends Destructable {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  color?: GUIColor;
  backgroundColor?: GUIColor;
  clickTrough?: boolean;
  children?: Pane[];
  drawPane: () => void;
  action?: () => void;
}
