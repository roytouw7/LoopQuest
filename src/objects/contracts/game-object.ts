import { GameObjectAction } from "./game-object-actions";
import { GameObjectConfig } from "./game-object-config";
import { Location } from "./position";
import { Sprite } from "./sprite";

export interface GameObject {
  id: string;
  sprite: Sprite;
  config: GameObjectConfig;
  location: Location;
  actions?: GameObjectAction[];
}
