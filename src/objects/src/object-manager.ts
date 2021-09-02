import { Observable } from "rxjs";
import { Manager } from "../../controllers/src/manager";
import { GameObject } from "../contracts/game-object";
import { Location } from "../contracts/position";

/** @todo should unregister game objects far enough away from perspective */
/** @Singleton responsible for registering and unregistering game objects */
export class ObjectManager {
  private static instance: ObjectManager;
  private readonly perspective$: Observable<Location>;
  private readonly manager: Manager<GameObject>;

  public get gameObjects$(): Observable<GameObject[]> {
    return this.manager.object$;
  }

  private constructor(perspective$: Observable<Location>) {
    this.manager = new Manager<GameObject>();
    this.perspective$ = perspective$;
  }

  public static getInstance(perspective$: Observable<Location>): ObjectManager {
    if (!ObjectManager.instance) {
      ObjectManager.instance = new ObjectManager(perspective$);
    }
    return ObjectManager.instance;
  }

  public registerGameObject(object: GameObject): void {
    this.manager.registerObject(object);
  }
}
