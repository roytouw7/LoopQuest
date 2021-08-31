import { map, Observable, startWith } from "rxjs";
import { getMousePositionStream, getZoomStream } from "../../IO";
import { getKeyboardStream } from "../../IO/src/keyboard";
import { GameObject } from "../../objects/contracts/game-object";
import { ChatInputPane } from "./chat-input-pane";
import { MouseInfoPane } from "./mouse-info-pane";
import { ZoomInfoPane } from "./zoom-info-pane";

export const buildGUI = (objectDetection$: Observable<GameObject[]>): void => {
  const mouseStream$ = getMousePositionStream().pipe(
    map((coordinate) => `x: ${coordinate.x} y: ${coordinate.y}`),
    startWith("x: 0 y: 0")
  );

  const zoomStream$ = getZoomStream().pipe(map((zoom) => `zoom: ${zoom}x`));

  const keyboardStream$ = getKeyboardStream();


  const objectDetectionDescription$ = objectDetection$.pipe(
    map((object) => object[0]?.config.description),
    map((description) => (description ? description : ""))
  );

  new MouseInfoPane(objectDetectionDescription$);
  new ZoomInfoPane(zoomStream$);
  new ChatInputPane(keyboardStream$);
};
