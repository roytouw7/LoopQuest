import { filter, map, Observable, of, switchMapTo, take } from "rxjs";
import { log } from "../../helper/logOperator";
import { getMouseClickStream, getZoomStream } from "../../IO";
import { keyboardInputToMessageStream } from "../../IO/src/chat";
import { getPaneActionStream, getPaneDetectionStream } from "../../IO/src/detection";
import { getKeyboardStream } from "../../IO/src/keyboard";
import { GameObject } from "../../objects/contracts/game-object";
import { Button } from "./button";
import { ChatInputPane } from "./chat-input-pane";
import { Menu } from "./menu-pane";
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
  
  const menu = new Menu(3, 6, 50, 50, [{ text$: of("item"), action: () => console.log("menu item") }]);
  paneManager.registerPane(menu);

  getPaneActionStream().subscribe((action) => action());
  // getPaneDetectionStream()
  //   .pipe(filter((pane) => pane?.action !== undefined))
  //   .subscribe((pane) => pane?.action());
};
