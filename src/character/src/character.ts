import { map, Observable, ReplaySubject, scan, share, startWith, tap, withLatestFrom } from "rxjs";
import { Coordinates } from "../../contracts";
import { Vector } from "../../movement/contracts/vector";
import { transformProjectionLocationToRealDistance } from "../../movement/src/movement";
import { BaseSprite } from "../../objects";
import { Location } from "../../objects/contracts/position";
import { Sprite } from "../../objects/contracts/sprite";
import { BaseGameObject } from "../../objects/src/game-object";

export class PlayerCharacter extends BaseGameObject {
  private readonly _position$: Observable<Location>;

  public get position$(): Observable<Location> {
    return this._position$.pipe(share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false }));
  }

  /**
   * @todo character should consume the new mapClickStream, but mapClickStream requires perspective from character...?
   */
  constructor(mapClick$: Observable<Coordinates>, startLocation: Location, zoom$: Observable<number>) {
    const sprite = PlayerCharacter.createCharacterSprite();
    super(sprite, { description: "The main character of the game!" }, startLocation);
    this._position$ = this.coordinateToLocation(mapClick$, startLocation, zoom$);
  }

  private coordinateToLocation(
    mouseClick$: Observable<Coordinates>,
    startLocation: Location,
    zoom$: Observable<number>
  ) {
    return mouseClick$.pipe(
      withLatestFrom(zoom$),
      map((set) => {
        const [mouseClick, zoom] = set;
        return transformProjectionLocationToRealDistance(mouseClick, zoom);
      }),
      scan((acc: Location, curr: Vector) => {
        return {
          x: acc.x + curr.dX,
          y: acc.y + curr.dY,
        };
      }, startLocation),
      tap((location) => (this.location = location)),
      startWith(startLocation)
    );
  }

  private static createCharacterSprite(): Sprite {
    return new BaseSprite(Symbol("character"), { height: 100, width: 100, url: "/assets/saphire-amulet.png" });
  }
}
