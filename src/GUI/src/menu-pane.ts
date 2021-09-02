import { Observable } from "rxjs";
import { Pane } from "../contracts";
import { BasePane } from "./base-pane";
import { Button } from "./button";

export interface ButtonConfig {
  text$: Observable<string>;
  action: (...args: unknown[]) => void;
}

/** @todo should have a destruct$ observable to know when the menu can be removed! */
export class Menu extends BasePane implements Pane {
  public children: Button[];

  constructor(width: number, buttonHeight: number, x: number, y: number, buttons: ButtonConfig[]) {
    const menuHeight = buttonHeight * buttons.length;
    super(width, menuHeight, x, y);
    this.children = this.createButtons(width, buttonHeight, x, y, buttons);
  }

  public drawPane(): void {
    this.children.forEach((button) => button.drawPane());
  }

  private createButtons(width: number, buttonHeight: number, x: number, y: number, buttons: ButtonConfig[]): Button[] {
    return buttons.map((button, index) => {
      console.log(y + index * buttonHeight)
      return new Button(button.text$, button.action, width, buttonHeight, x, y + (index * buttonHeight));
    });
  }
}
