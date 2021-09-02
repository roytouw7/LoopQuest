import { map, Observable, withLatestFrom } from "rxjs";
import { getMousePositionStream, getZoomStream } from "../../IO";
import { keyboardInputToMessageStream } from "../../IO/src/chat";
import { getPaneActionStream } from "../../IO/src/detection";
import { getKeyboardStream } from "../../IO/src/keyboard";
import { GameObject } from "../../objects/contracts/game-object";
import { ChatInputPane } from "./chat-input-pane";
import { Menu } from "./menu-pane";
import { MouseInfoPane } from "./mouse-info-pane";
import { PaneManager } from "./pane-manager";
import { PaneRenderer } from "./pane-renderer";
import { getGameObjectRightClickMenuStream } from "./right-click-menu";
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

  getPaneActionStream().subscribe((action) => action());

  /** @fixme use the mouseposition to render menu instead of trivial 50,50 */
  getGameObjectRightClickMenuStream(objectDetection$)
    .pipe(withLatestFrom(getMousePositionStream()))
    .subscribe((set) => {
      const [ButtonConfigs, mousePosition] = set;
      const { x, y } = mousePosition;
      paneManager.registerPane(new Menu(6, 3, 50, 50, ButtonConfigs));
    });
};
