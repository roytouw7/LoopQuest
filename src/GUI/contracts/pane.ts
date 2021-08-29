import { GUIColor } from "./gui-color";


export interface Pane {
    id: string;
    width: number;
    height: number;
    x: number;
    y: number;
    color?: GUIColor
    backgroundColor?: GUIColor;
}
