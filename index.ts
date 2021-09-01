import { Observable, ReplaySubject, share, switchMap, switchMapTo, take } from "rxjs";
import { PlayerCharacter } from "./src/character/src/character";
import { buildGUI } from "./src/GUI/src/GUI";
import { PaneManager } from "./src/GUI/src/pane-manager";
import {
  getMouseClickStream,
  getMousePositionStream,
  getRightMouseClickStream,
  getZoomStream,
  setCanvasFullScreen,
} from "./src/IO/src";
import { getObjectDetectionStream } from "./src/objects/src/object-detection";
import { GameObject } from "./src/objects/contracts/game-object";
import { getGameObjectFactory } from "./src/objects/src/game-object-factory";
import { ObjectManager } from "./src/objects/src/object-manager";
import { ObjectRenderer } from "./src/objects/src/object-renderer";
import { getPaneDetectionStream } from "./src/GUI/src/pane-detection";
import {
  getPaneDetectionStream as newPaneDetectionStream,
  getGameObjectDetectionStream as newGameObjectDetectionStream,
  getMapClickStream
} from "./src/IO/src/detection";

setCanvasFullScreen().subscribe(() => {
  const characterStartLocation = { x: 0, y: 0 };
  const paneDetection$ = getPaneDetectionStream(getMousePositionStream(), PaneManager.getInstance().panes$);
  const character = new PlayerCharacter(getMouseClickStream(), characterStartLocation, getZoomStream());
  const perspective$ = character.position$.pipe(share({ connector: () => new ReplaySubject(1) }));

  newPaneDetectionStream().subscribe();
  newGameObjectDetectionStream(perspective$).subscribe()
  getMapClickStream(perspective$).subscribe(console.log);

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
      gameObjects.forEach((object) =>
        object.actions?.forEach((action) => console.log(`${action.description} ${object.config.description}`))
      );
    });
};
