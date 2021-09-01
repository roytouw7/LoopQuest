import { combineLatestWith, map, Observable, ReplaySubject, share, throttleTime } from "rxjs";
import { Coordinates } from "../../contracts";
import { transformProjectionLocationToRealDistance } from "../../movement/src/movement";
import { GameObject } from "../contracts/game-object";
import { Location } from "../contracts/position";

export const getObjectDetectionStream = (
  perspective$: Observable<Location>,
  mousePosition$: Observable<Coordinates>,
  gameObjects$: Observable<GameObject[]>,
  zoom$: Observable<number>
): Observable<GameObject[]> => {
  return perspective$.pipe(
    combineLatestWith(mousePosition$, gameObjects$, zoom$),
    map((set) => {
      const [perspective, mousePosition, gameObjects, zoom] = set;
      const delta = transformProjectionLocationToRealDistance(mousePosition, zoom);
      const location: Location = {
        x: perspective.x + delta.dX,
        y: perspective.y + delta.dY,
      };

      const gameObjectMatches = gameObjects.filter((object) => objectAtLocation(object, location));

      return gameObjectMatches;
    }),
    throttleTime(100),
    share({ connector: () => new ReplaySubject(1) })
  );
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
