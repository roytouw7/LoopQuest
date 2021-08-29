import { Observable, ReplaySubject, share, Subject } from "rxjs";
import { GameObject } from "../contracts/game-object";
import { Location } from "../contracts/position";

/** @todo should unregister game objects far enough away from perspective */
/** @Singleton responsible for registering and unregistering game objects */
export class ObjectManager {
  private static instance: ObjectManager;
  private readonly gameObjects: GameObject[] = [];
  private readonly _gameObjects$: Subject<GameObject[]>;
  private readonly perspective$: Observable<Location>;

  public get gameObjects$(): Observable<GameObject[]> {
    return this._gameObjects$.pipe(share({ resetOnRefCountZero: false, connector: () => new ReplaySubject(1) }));
  }

  private constructor(perspective$: Observable<Location>) {
    this._gameObjects$ = new Subject<GameObject[]>();
    this.perspective$ = perspective$;
  }

  public static getInstance(perspective$: Observable<Location>): ObjectManager {
    if (!ObjectManager.instance) {
      ObjectManager.instance = new ObjectManager(perspective$);
    }
    return ObjectManager.instance;
  }

  public registerGameObject(object: GameObject): void {
    this.gameObjects.push(object);
    this._gameObjects$.next(this.gameObjects);
  }
}
