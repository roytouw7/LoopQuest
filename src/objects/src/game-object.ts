import { Subject } from "rxjs";
import { Destructable } from "../../GUI/contracts";
import { GameObject } from "../contracts/game-object";
import { GameObjectConfig } from "../contracts/game-object-config";
import { Location } from "../contracts/position";
import { Sprite } from "../contracts/sprite";

export class BaseGameObject implements GameObject, Destructable {
  private readonly _destroy$: Subject<void> = new Subject<void>();
  readonly sprite: Sprite;
  readonly config: GameObjectConfig;
  location: Location;

  get destroy$() {
    return this._destroy$.asObservable();
  }

  get description(): string {
    return this.config.description;
  }

  constructor(sprite: Sprite, config: GameObjectConfig, location: Location) {
    if (!sprite) {
      throw new Error("GameObject has no valid sprite!");
    }
    this.sprite = sprite;
    this.config = config;
    this.location = location;
  }

  public destruct(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
