import { Observable } from "rxjs";
import { PaneConfig } from "../contracts";
import { TextAlign, TextConfig, VerticalTextAlign } from "../contracts/text-config";
import { TextPane } from "./text-pane";

export class MouseInfoPane extends TextPane {
  constructor(mouseInfo$: Observable<string>) {
    const config: PaneConfig = {
      width: 60,
      height: 3,
      x: 40,
      y: 0,
    };

    const textConfig: TextConfig = {
      textAlign: TextAlign.RIGHT,
      verticalTextAlign: VerticalTextAlign.CENTER,
    };

    super(config, mouseInfo$, textConfig);
  }
}
