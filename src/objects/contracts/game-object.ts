import { GameObjectConfig } from "./game-object-config";
import { Location } from "./position";
import { Sprite } from "./sprite";

export interface GameObject {
  sprite: Sprite;
  config: GameObjectConfig;
  location: Location;
}
