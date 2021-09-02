import { Observable, switchMapTo, take } from "rxjs";
import { PlayerCharacter } from "./src/character/src/character";
import { buildGUI } from "./src/GUI/src/GUI";
import { getRightMouseClickStream, getZoomStream, setCanvasFullScreen } from "./src/IO/src";
import { getGameObjectDetectionStream } from "./src/IO/src/detection";
import { GameObject } from "./src/objects/contracts/game-object";
import { getGameObjectFactory } from "./src/objects/src/game-object-factory";
import { ObjectManager } from "./src/objects/src/object-manager";
import { ObjectRenderer } from "./src/objects/src/object-renderer";

setCanvasFullScreen().subscribe(() => {
  const characterStartLocation = { x: 0, y: 0 };
  const character = new PlayerCharacter(characterStartLocation);

  setupGameObjectCreationAndRendering(character);

  const gameObjectDetection$ = getGameObjectDetectionStream(character.position$);

  buildGUI(gameObjectDetection$);
  testRightClickObjectSelection(gameObjectDetection$);
});

const setupGameObjectCreationAndRendering = (character: PlayerCharacter): void => {
  const perspective$ = character.position$;
  const objectManager = ObjectManager.getInstance(perspective$);
  const objectRenderer = new ObjectRenderer(perspective$, getZoomStream());
  const renderRadius = 100;
  const gameObjectFactory = getGameObjectFactory(perspective$, renderRadius);

  perspective$.pipe(take(1), switchMapTo(gameObjectFactory())).subscribe((gameObjects) => {
    gameObjects.forEach((gameObject) => objectManager.registerGameObject(gameObject));
  });
  objectManager.registerGameObject(character);
};

const testRightClickObjectSelection = (objectDetection$: Observable<GameObject[]>) => {
  // getRightMouseClickStream()
  //   .pipe(switchMapTo(objectDetection$.pipe(take(1))))
  //   .subscribe(console.log);


  
  // getRightMouseClickStream()
  //   .pipe(log('rightclick'),switchMapTo(objectDetection$), take(1))
  //   .subscribe((gameObjects) => {
  //     gameObjects.forEach((object) =>
  //       object.actions?.forEach((action) => console.log(`${action.description} ${object.config.description}`))
  //     );
  //   });
};
