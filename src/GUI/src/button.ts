import { of } from "rxjs";
import { TextPane } from "./text-pane";

export class Button extends TextPane {
  constructor() {
    super(
      { height: 2, width: 4, x: 0, y: 0, backgroundColor: { hex: "#000000" }, color: { hex: "#FF00FF" } },
      of("Button")
    );
    console.log("making button");
  }
}
