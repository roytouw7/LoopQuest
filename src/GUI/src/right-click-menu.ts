import { map, Observable, of, switchMapTo, take } from "rxjs";
import { getRightMouseClickStream } from "../../IO";
import { GameObject } from "../../objects/contracts/game-object";
import { ButtonConfig } from "./menu-pane";

export const getGameObjectRightClickMenuStream = (
  objectDetection$: Observable<GameObject[]>
): Observable<ButtonConfig[]> => {
  return getRightMouseClickStream().pipe(
    switchMapTo(objectDetection$.pipe(take(1))),
    map(gameObjectActionsToButtonConfigs)
  );
};

const gameObjectActionsToButtonConfigs = (gameObjects: GameObject[]): ButtonConfig[] => {
  return gameObjects.flatMap(gameObjectToButtonConfig);
};

/** @fixme ugly typing but working */
const gameObjectToButtonConfig = (gameObject: GameObject): ButtonConfig[] => {
  const actions = gameObject.actions;
  if (actions) {
    return actions.map((action) => {
      return {
        text$: of(action.description),
        action: (gameObject as any)[action.handler],
      };
    });
  }
  return [];
};
