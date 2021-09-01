import { combineLatestWith, filter, map, Observable, ReplaySubject, share, switchMapTo, withLatestFrom } from "rxjs";
import { Coordinates } from "../../contracts";
import { Pane } from "../../GUI/contracts";
import { PaneManager } from "../../GUI/src/pane-manager";
import { Vector } from "../../movement/contracts/vector";
import { transformProjectionLocationToRealDistance } from "../../movement/src/movement";
import { GameObject } from "../../objects/contracts/game-object";
import { Location } from "../../objects/contracts/position";
import { ObjectManager } from "../../objects/src/object-manager";
import { getMouseClickStream, getMousePositionStream, getZoomStream } from "./mouse-input";

export const getPaneDetectionStream = (): Observable<Pane | null> => {
  const mouseLocation$ = getMousePositionStream();
  const panes$ = PaneManager.getInstance().panes$;

  return mouseLocation$.pipe(
    withLatestFrom(panes$),
    map((set) => {
      const [position, panes] = set;
      const pane = panes.find((pane) => paneAtPosition(position, pane));

      return pane ? pane : null;
    }),
    share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false })
  );
};

export const getGameObjectDetectionStream = (perspective$: Observable<Location>): Observable<GameObject[]> => {
  const mouseLocation$ = getMousePositionStream();
  const gameObjects$ = ObjectManager.getInstance(perspective$).gameObjects$;
  const zoom$ = getZoomStream();
  const pane$ = getPaneDetectionStream();

  return pane$.pipe(
    switchMapTo(mouseLocation$.pipe(combineLatestWith(gameObjects$, zoom$, perspective$, pane$))),
    map((set) => {
      const [mousePosition, gameObjects, zoom, perspective, pane] = set;
      if (pane) {
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

export const getMapClickStream = (perspective$: Observable<Location>): Observable<Location> => {
  const mouseClick$ = getMouseClickStream();
  const zoom$ = getZoomStream();
  const pane$ = getPaneDetectionStream();
  const gameObjects$ = getGameObjectDetectionStream(perspective$);

  return mouseClick$.pipe(
    withLatestFrom(zoom$, perspective$, pane$, gameObjects$),
    map((set) => {
      const [mouseClickPosition, zoom, perspective, pane, gameObjects] = set;
      if (pane || gameObjects.length) {
        return null;
      }

      const delta = transformProjectionLocationToRealDistance(mouseClickPosition, zoom);
      return addDistanceToMoveWithCurrentPosition(perspective, delta);
    }),
    filter((location: Location | null) => location !== null)
  ) as Observable<Location>;
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

const addDistanceToMoveWithCurrentPosition = (perspective: Location, delta: Vector): Location => {
  return {
    x: perspective.x + delta.dX,
    y: perspective.y + delta.dY,
  };
};
