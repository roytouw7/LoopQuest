import axios from "axios";
import { combineLatestWith, from, map, Observable, pluck } from "rxjs";
import { GameObject } from "../contracts/game-object";
import { Location } from "../contracts/position";
import { Sprite } from "../contracts/sprite";
import { BaseSprite } from "./base-sprite";
import { BaseGameObject } from "./game-object";

interface GameObjectSeed {
  identifier: string;
  class: string;
  spriteClass: string;
  sprite: string;
  width: number;
  height: number;
  description: string;
}

interface GameObjectInstanceSeed {
  identifier: string;
  x: number;
  y: number;
}

/** @todo Perspective and radius should be included to only load instances withing radius */
export const getGameObjectFactory = (perspective$: Observable<Location>, radius: number) => {
  return () => {
    return from(axios.get<GameObjectSeed[]>("public/game-objects.json")).pipe(
      pluck("data"),
      combineLatestWith(fetchGameObjectInstanceSeeds()),
      map((set) => {
        const [gameObjectSeeds, gameObjectInstanceSeeds] = set;
        const sprites = createSprites(gameObjectSeeds);
        const instances = createGameObjectInstances(gameObjectInstanceSeeds, gameObjectSeeds, sprites);
        return instances;
      })
    );
  };
};

const createSprites = (gameObjectSeeds: GameObjectSeed[]): Sprite[] => {
  return gameObjectSeeds.map((seed) => createSprite(seed));
};

const createSprite = (seed: GameObjectSeed): Sprite => {
  switch (seed.spriteClass) {
    case "sprite":
      return new BaseSprite(seed.identifier, {
        url: seed.sprite,
        height: seed.height,
        width: seed.width,
      });
    default:
      throw new Error(`Invalid GameObjectSeed spriteClass ${seed.spriteClass}!`);
  }
};

const fetchGameObjectInstanceSeeds = (): Observable<GameObjectInstanceSeed[]> => {
  return from(axios.get<GameObjectInstanceSeed[]>("public/game-object-instances.json")).pipe(pluck("data"));
};

const createGameObjectInstances = (
  gameObjectInstanceSeeds: GameObjectInstanceSeed[],
  gameObjectSeeds: GameObjectSeed[],
  sprites: Sprite[]
): GameObject[] => {
  return gameObjectInstanceSeeds.map((gameObjectInstanceSeed) => {
    const gameObjectSeed = gameObjectSeeds.find((object) => object.identifier === gameObjectInstanceSeed.identifier);
    const sprite = sprites.find((sprite) => sprite.spriteConfig.url === gameObjectSeed?.sprite);
    if (!gameObjectSeed) {
      throw new Error(
        `GameObject and GameObjectInstance mismatch! No matching gameObjectSeed found for ${gameObjectInstanceSeed.identifier}!`
      );
    } else if (!sprite) {
      throw new Error(`GameObject and Sprite mismatch! No matching sprite found for ${gameObjectSeed.sprite}!`);
    }
    return createInstance(gameObjectInstanceSeed, gameObjectSeed, sprite);
  });
};

const createInstance = (
  gameObjectInstanceSeed: GameObjectInstanceSeed,
  gameObjectSeed: GameObjectSeed,
  sprite: Sprite
): GameObject => {
  switch (gameObjectSeed.class) {
    case "baseGameObject":
      const location = { x: gameObjectInstanceSeed.x, y: gameObjectInstanceSeed.y };
      return new BaseGameObject(sprite, { description: gameObjectSeed.description }, location);
    default:
      throw new Error(`Invalid GameObjectSeed class ${gameObjectSeed.class}!`);
  }
};