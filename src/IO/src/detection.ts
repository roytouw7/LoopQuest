import {
  combineLatestWith,
  filter,
  map,
  Observable,
  of,
  ReplaySubject,
  scan,
  share,
  switchMapTo,
  take,
  withLatestFrom,
} from "rxjs";
import { Coordinates } from "../../contracts";
import { Pane } from "../../GUI/contracts";
import { PaneManager } from "../../GUI/src/pane-manager";
import { isNotUndefined } from "../../helper/notUndefinedOperator";
import { Vector } from "../../movement/contracts/vector";
import { transformProjectionLocationToRealDistance } from "../../movement/src/movement";
import { GameObject } from "../../objects/contracts/game-object";
import { Location } from "../../objects/contracts/position";
import { ObjectManager } from "../../objects/src/object-manager";
import { getMouseClickStream, getMousePositionStream, getZoomStream } from "./mouse-input";

export const getPaneDetectionStream = (): Observable<Pane[]> => {
  const mouseLocation$ = getMousePositionStream();
  const panes$ = PaneManager.getInstance().panes$;

  return mouseLocation$.pipe(
    withLatestFrom(panes$),
    map((set) => {
      const [position, panes] = set;
      const detectedPanes = panes.filter((pane) => paneAtPosition(position, pane));

      return detectedPanes;
    }),
    share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false })
  );
};

export const getGameObjectDetectionStream = (perspective$: Observable<Location>): Observable<GameObject[]> => {
  const mouseLocation$ = getMousePositionStream();
  const gameObjects$ = ObjectManager.getInstance(perspective$).gameObjects$;
  const zoom$ = getZoomStream();
  const panes$ = getPaneDetectionStream();

  return panes$.pipe(
    switchMapTo(mouseLocation$.pipe(combineLatestWith(gameObjects$, zoom$, perspective$, panes$))),
    map((set) => {
      const [mousePosition, gameObjects, zoom, perspective, panes] = set;
      if (panes.length > 0) {
        // Pane in front of object
        return [];
      }

      const delta = transformProjectionLocationToRealDistance(mousePosition, zoom);
      const location: Location = {
        x: perspective.x + delta.dX,
        y: perspective.y + delta.dY,
      };

      const gameObjectMatches = gameObjects.filter((object) => objectAtLocation(object, location));

      return gameObjectMatches;
    }),
    share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false })
  );
};

export const getMapClickStream = (): Observable<Vector> => {
  const mouseClick$ = getMouseClickStream();
  const zoom$ = getZoomStream();
  const panes$ = getPaneDetectionStream();

  return mouseClick$.pipe(
    withLatestFrom(zoom$, panes$),
    map((set) => {
      const [mouseClickPosition, zoom, panes] = set;
      if (panes.length > 0) {
        return null;
      }

      const delta = transformProjectionLocationToRealDistance(mouseClickPosition, zoom);
      return delta;
    }),
    filter((delta: Vector | null) => delta !== null)
  ) as Observable<Vector>;
};

/** @todo should cancel out on object click */
/** Turns a vector stream and a starting location into a mapPosition stream. */
export const getMapLocationStream = (
  startLocation: Location,
  vectorStream$: Observable<Vector>
): Observable<Location> => {
  return of(startLocation).pipe(
    switchMapTo(
      vectorStream$.pipe(
        scan((acc, curr) => {
          return {
            x: acc.x + curr.dX,
            y: acc.y + curr.dY,
          };
        }, startLocation)
      )
    ),
    share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false })
  );
};

export const getPaneActionStream = (): Observable<(...args: unknown[]) => void> => {
  return getMouseClickStream().pipe(
    switchMapTo(
      getPaneDetectionStream().pipe(
        take(1),
        filter((panes) => panes.length > 0),
        map((panes) => panes.filter((pane) => pane.action).pop()?.action),
        filter(isNotUndefined)
      )
    )
  );
};

const paneAtPosition = (position: Coordinates, pane: Pane): boolean => {
  if (!pane.clickTrough) {
    if (position.x > pane.x && position.x < pane.x + pane.width) {
      if (position.y > pane.y && position.y < pane.y + pane.height) {
        return true;
      }
    }
  }
  return false;
};

const objectAtLocation = (object: GameObject, location: Location): boolean => {
  const { width, height } = object.sprite.spriteConfig;
  const objectLocation = object.location;

  if (location.x > objectLocation.x - width / 2 && location.x < objectLocation.x + width / 2) {
    if (location.y > objectLocation.y - height / 2 && location.y < objectLocation.y + height / 2) {
      return true;
    }
  }
  return false;
};
