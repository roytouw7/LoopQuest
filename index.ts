import { Observable, switchMapTo, take } from "rxjs";
import { PlayerCharacter } from "./src/character/src/character";
import { buildGUI } from "./src/GUI/src/GUI";
import { getMouseClickStream, getRightMouseClickStream, getZoomStream, setCanvasFullScreen } from "./src/IO/src";
import { getGameObjectDetectionStream as newGameObjectDetectionStream, getMapClickStream, getMapLocationStream } from "./src/IO/src/detection";
import { GameObject } from "./src/objects/contracts/game-object";
import { getGameObjectFactory } from "./src/objects/src/game-object-factory";
import { ObjectManager } from "./src/objects/src/object-manager";
import { ObjectRenderer } from "./src/objects/src/object-renderer";

setCanvasFullScreen().subscribe(() => {
  const characterStartLocation = { x: 0, y: 0 };
  const character = new PlayerCharacter(characterStartLocation);
  const perspective$ = character.position$;

  const gameObjectDetection$ = newGameObjectDetectionStream(perspective$);
  getMapLocationStream({x: 0, y: 0}, getMapClickStream()).subscribe(console.log)

  const objectManager = ObjectManager.getInstance(perspective$);
  const objectRenderer = new ObjectRenderer(perspective$, getZoomStream());
  const renderRadius = 100;
  const gameObjectFactory = getGameObjectFactory(perspective$, renderRadius);

  perspective$.pipe(switchMapTo(gameObjectFactory())).subscribe((gameObjects) => {
    gameObjects.forEach((gameObject) => objectManager.registerGameObject(gameObject));
  });
  objectManager.registerGameObject(character);

  buildGUI(gameObjectDetection$);

  testRightClickObjectSelection(gameObjectDetection$);
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
