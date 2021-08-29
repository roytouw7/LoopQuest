import { Observable } from "rxjs";
import { PaneConfig } from "../contracts";
import { TextAlign, TextConfig, VerticalTextAlign } from "../contracts/text-config";
import { TextPane } from "./text-pane";

export class ZoomInfoPane extends TextPane {
  constructor(zoomInfo$: Observable<string>) {
    const config: PaneConfig = {
      width: 7,
      height: 6,
      x: 0,
      y: 0,
    };

    const textConfig: TextConfig = {
      textAlign: TextAlign.LEFT,
      verticalTextAlign: VerticalTextAlign.CENTER,
    };

    super(config, zoomInfo$, textConfig);
  }
}
