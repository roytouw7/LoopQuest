import { Observable } from "rxjs";
import { Pane } from "../contracts";
import { TextPane } from "./text-pane";

export class Button extends TextPane implements Pane {
  public readonly action: (...args: any[]) => void;

  constructor(text$: Observable<string>, action: (...args: any[]) => void, width: number, height: number, x: number, y: number) {
    super({ height: 3, width: 6, x: 50, y: 50, backgroundColor: { hex: "#000000" }, color: { hex: "#FF00FF" } }, text$);

    this.action = action;
  }
  
}
