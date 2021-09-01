import { map, Observable } from "rxjs";
import { getZoomStream } from "../../IO";
import { keyboardInputToMessageStream } from "../../IO/src/chat";
import { getKeyboardStream } from "../../IO/src/keyboard";
import { GameObject } from "../../objects/contracts/game-object";
import { ChatInputPane } from "./chat-input-pane";
import { MouseInfoPane } from "./mouse-info-pane";
import { PaneManager } from "./pane-manager";
import { PaneRenderer } from "./pane-renderer";
import { ZoomInfoPane } from "./zoom-info-pane";

export const buildGUI = (objectDetection$: Observable<GameObject[]>): void => {
  const objectDetectionDescription$ = objectDetection$.pipe(
    map((object) => object[0]?.config.description),
    map((description) => (description ? description : ""))
  );

  const zoomStream$ = getZoomStream().pipe(map((zoom) => `zoom: ${zoom}x`));

  const chatStream$ = keyboardInputToMessageStream(getKeyboardStream());

  const paneManager = PaneManager.getInstance();
  const paneRenderer = new PaneRenderer(paneManager.panes$);

  paneManager.registerPane(new ZoomInfoPane(zoomStream$));
  paneManager.registerPane(new ChatInputPane(chatStream$));
  paneManager.registerPane(new MouseInfoPane(objectDetectionDescription$));
};
