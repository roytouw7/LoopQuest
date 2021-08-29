import axios from "axios";
import { combineLatest, from, map, of, pluck, switchMap, tap } from "rxjs";
import { Location } from "../contracts/position";
import { Sprite } from "../contracts/sprite";
import { BaseGameObject } from "./game-object";
import { getSpriteFactory } from "./sprite-factory";

interface GameObjectSeed {
  gameObject: string;
  description: string;
  x: number;
  y: number;
}

/** @deprecated Returns a factory function to retrieve game objects from given perspective within given radius.  */
export const getGameObjectFactoryDeprecated = () => {
  const spriteFactory = getSpriteFactory();

  return (perspective: Location, radius: number) => {
    return from(axios.get<GameObjectSeed[]>("public/game-object-instances.json")).pipe(
      pluck("data"),
      /** @todo only fetch game objects in specific radius (from perspective) */
      switchMap((seeds) => combineLatest([of(seeds), spriteFactory(seeds.map((seed) => seed.gameObject))])),
      map((set) => {
        const [seeds, sprites] = set;
        return seeds.map((seed) => {
          const sprite = sprites.find((sprite) => sprite.identifier === seed.gameObject);
          if (!sprite) {
            throw new Error(`No sprite found for identifier ${seed.gameObject}`);
          }
          // console.log(seed)
          return createGameObject(sprite, seed);
        });
      })
    );
  };
};

const createGameObject = (sprite: Sprite, gameObjectSeed: GameObjectSeed): BaseGameObject => {
  const { x, y, description } = gameObjectSeed;
  return new BaseGameObject(sprite, { description }, { x, y });
};
