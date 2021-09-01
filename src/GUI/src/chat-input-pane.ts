import { Observable } from "rxjs";
import { PaneConfig } from "../contracts";
import { TextAlign, TextConfig, VerticalTextAlign } from "../contracts/text-config";
import { TextPane } from "./text-pane";

export class ChatInputPane extends TextPane {
  constructor(chatInput$: Observable<string>) {
    const config: PaneConfig = {
      width: 100,
      height: 5,
      x: 0,
      y: 95,
    };

    const textConfig: TextConfig = {
      textAlign: TextAlign.LEFT,
      verticalTextAlign: VerticalTextAlign.CENTER,
    };

    super(config, chatInput$, textConfig);
  }
}
