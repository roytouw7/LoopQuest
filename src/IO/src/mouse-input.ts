import {
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  mapTo,
  Observable,
  pluck,
  ReplaySubject,
  scan,
  share,
  startWith,
  switchMapTo,
  take,
  throttleTime,
} from "rxjs";
import { Coordinates } from "../../contracts";
import { ClickEvent } from "../contracts";

const createMousePositionStream = () => {
  const source$ = fromEvent<MouseEvent>(document, "mousemove").pipe(
    map((event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      return { x, y };
    }),
    throttleTime(10),
    startWith({ x: -1, y: -1 }),
    distinctUntilChanged(),
    share({
      resetOnRefCountZero: false,
      connector: () => new ReplaySubject(1),
    })
  );
  return (): Observable<Coordinates> => {
    return source$;
  };
};

const createMouseClickStream = () => {
  const mousePositionStream$ = getMousePositionStream().pipe(take(1));
  const source$ = fromEvent<ClickEvent>(document, "click").pipe(switchMapTo(mousePositionStream$));

  return () => source$;
};

const createRightMouseClickStream = () => {
  const mousePositionStream$ = getMousePositionStream().pipe(take(1));
  const source$ = fromEvent(document, "mousedown").pipe(
    pluck("button"),
    filter((button) => button === 2),
    mapTo(void 0),
    switchMapTo(mousePositionStream$)
  );

  return () => source$;
};

const zoomLevels = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 1.85, 1.95, 2];

const createZoomStream = () => {
  const source$ = fromEvent<{ deltaY: number }>(document, "wheel").pipe(
    pluck("deltaY"),
    throttleTime(100),
    filter((delta) => Math.abs(delta) > 1),
    map((delta) => (delta > 0 ? 1 : -1)),
    scan((acc: number, curr) => (acc += curr), 10),
    filter((delta) => delta >= 0 && delta <= 14),
    map((index) => zoomLevels[index]),
    startWith(1),
    share({
      connector: () => new ReplaySubject(1),
      resetOnRefCountZero: false,
      resetOnComplete: false,
    })
  );

  return () => source$;
};

export const getMousePositionStream = createMousePositionStream();
export const getMouseClickStream = createMouseClickStream();
export const getRightMouseClickStream = createRightMouseClickStream();
export const getZoomStream = createZoomStream();
