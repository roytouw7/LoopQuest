import { map, Observable, startWith } from "rxjs";
import { getMousePositionStream, getZoomStream } from "../../IO";
import { getKeyboardStream } from "../../IO/src/keyboard";
import { ChatInputPane } from "./chat-input-pane";
import { MouseInfoPane } from "./mouse-info-pane";
import { ZoomInfoPane } from "./zoom-info-pane";

export const buildGUI = (objectDetection$: Observable<string>): void => {
  const mouseStream$ = getMousePositionStream().pipe(
    map((coordinate) => `x: ${coordinate.x} y: ${coordinate.y}`),
    startWith("x: 0 y: 0")
  );

  const zoomStream$ = getZoomStream().pipe(map((zoom) => `zoom: ${zoom}x`));

  const keyboardStream$ = getKeyboardStream();

  new MouseInfoPane(objectDetection$);
  new ZoomInfoPane(zoomStream$);
  new ChatInputPane(keyboardStream$);
};
