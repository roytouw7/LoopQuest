import { Sprite } from "../contracts/sprite";
import axios from "axios";
import { from, map, Observable, pluck, tap } from "rxjs";
import { BaseSprite } from "./base-sprite";

interface SpriteSeed {
  identifier: string;
  class: string;
  sprite: string;
  width: number;
  height: number;
}

/** @todo think of a better way of fetching sprites than to fetch whole data each request */
export const getSpriteFactory = () => {
  return (identifiers: string[]): Observable<Sprite[]> => {
    return from(axios.get<SpriteSeed[]>("public/game-objects.json")).pipe(
      pluck("data"),
      map((seeds) => {
        const spriteSeed = seeds.filter((seed) => identifiers.includes(seed.identifier));
        if (!spriteSeed) {
          throw new Error(`Sprite seed with identifiers ${JSON.stringify(identifiers)} not found!`);
        }
        return createSprites(spriteSeed);
      })
    );
  };
};

const createSprites = (seeds: SpriteSeed[]): Sprite[] => {
  return seeds.map((seed) => createSprite(seed));
};

const createSprite = (seed: SpriteSeed): Sprite => {
  switch (seed.class) {
    case "sprite":
      return new BaseSprite(seed.identifier, {
        url: seed.sprite,
        height: seed.height,
        width: seed.width,
      });
    default:
      throw new Error(`Invalid sprite seed class ${seed.class}!`);
  }
};
