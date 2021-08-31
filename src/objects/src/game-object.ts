import { Subject } from "rxjs";
import { Destructable } from "../../GUI/contracts";
import { GameObject } from "../contracts/game-object";
import { GameObjectAction } from "../contracts/game-object-actions";
import { GameObjectConfig } from "../contracts/game-object-config";
import { Location } from "../contracts/position";
import { Sprite } from "../contracts/sprite";
import { v4 as uuid } from "uuid";

export class BaseGameObject implements GameObject, Destructable {
  readonly id: string;
  private readonly _destroy$: Subject<void> = new Subject<void>();
  readonly sprite: Sprite;
  readonly config: GameObjectConfig;
  readonly actions?: GameObjectAction[];
  location: Location;

  get destroy$() {
    return this._destroy$.asObservable();
  }

  get description(): string {
    return this.config.description;
  }

  constructor(sprite: Sprite, config: GameObjectConfig, location: Location, actions?: GameObjectAction[]) {
    if (!sprite) {
      throw new Error("GameObject has no valid sprite!");
    }
    this.checkActionImplementations(actions);
    this.id = uuid();
    this.sprite = sprite;
    this.config = config;
    this.actions = actions;
    this.location = location;
  }

  public destruct(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @todo implement or remove */
  public examine(): void {
    console.log("examine!");
  }

  protected checkActionImplementations(actions: GameObjectAction[] | undefined): void {
    actions?.forEach((action) => {
      const handler = action.handler as keyof this;
      if (typeof this[handler] !== "function") {
        throw new Error(
          `Handler ${action.handler} for action ${action.description} not implemented in ${this.constructor.name}!`
        );
      }
    });
  }
}
