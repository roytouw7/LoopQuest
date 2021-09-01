import { Observable, ReplaySubject, share, switchMap, switchMapTo, take } from "rxjs";
import { PlayerCharacter } from "./src/character/src/character";
import { Button } from "./src/GUI/src/button";
import { buildGUI } from "./src/GUI/src/GUI";
import {
  getMouseClickStream,
  getMousePositionStream,
  getRightMouseClickStream,
  getZoomStream,
  setCanvasFullScreen
} from "./src/IO/src";
import { GameObject } from "./src/objects/contracts/game-object";
import { getGameObjectFactory } from "./src/objects/src/game-object-factory";
import { getObjectDetectionStream } from "./src/objects/src/object-detection";
import { ObjectManager } from "./src/objects/src/object-manager";
import { ObjectRenderer } from "./src/objects/src/object-renderer";

setCanvasFullScreen().subscribe(() => {
  const characterStartLocation = { x: 0, y: 0 };
  const character = new PlayerCharacter(getMouseClickStream(), characterStartLocation, getZoomStream());
  const perspective$ = character.position$.pipe(share({ connector: () => new ReplaySubject(1) }));

  const objectManager = ObjectManager.getInstance(perspective$);
  const objectRenderer = new ObjectRenderer(perspective$, getZoomStream());
  const renderRadius = 100;
  const gameObjectFactory = getGameObjectFactory(perspective$, renderRadius);

  perspective$.pipe(switchMap((perspective) => gameObjectFactory())).subscribe((gameObjects) => {
    gameObjects.forEach((gameObject) => objectManager.registerGameObject(gameObject));
  });
  objectManager.registerGameObject(character);

  const objectDetection$ = getObjectDetectionStream(
    perspective$,
    getMousePositionStream(),
    objectManager.gameObjects$,
    getZoomStream()
  );

  buildGUI(objectDetection$);

  testRightClickObjectSelection(objectDetection$);
  // new Button();
});

const testRightClickObjectSelection = (objectDetection$: Observable<GameObject[]>) => {
  getRightMouseClickStream()
    .pipe(switchMapTo(objectDetection$), take(1))
    .subscribe((gameObjects) => {
      gameObjects.forEach(object => object.actions?.forEach(action => console.log(`${action.description} ${object.config.description}`)))
    });
};
