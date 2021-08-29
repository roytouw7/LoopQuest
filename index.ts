import { map, ReplaySubject, share, switchMap } from "rxjs";
import { PlayerCharacter } from "./src/character/src/character";
import { buildGUI } from "./src/GUI/src/GUI";
import { getMouseClickStream, getMousePositionStream, getZoomStream, setCanvasFullScreen } from "./src/IO/src";
import { getGameObjectFactory } from "./src/objects/src/game-object-factory2";
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
  ).pipe(
    map((gameObjects) => gameObjects.pop()?.config.description),
    map((description) => (description ? description : ""))
  );

  buildGUI(objectDetection$);
});
