import { GUIColor } from "../contracts";

export class Config {
  private constructor() {}

  static defaultFont: string = "20px Comic Sans MS";
  static defaultColor: GUIColor = { hex: "#000000" };
  static defaultBackgroundColor: GUIColor = { hex: "#FFFFFF" };
}
