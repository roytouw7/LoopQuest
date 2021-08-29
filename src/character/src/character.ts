import { map, Observable, scan, startWith, tap, withLatestFrom } from "rxjs";
import { Coordinates } from "../../contracts";
import { cleanupOnDestroy } from "../../GUI/decorators/cleanup-on-destroy";
import { Vector } from "../../movement/contracts/vector";
import { move } from "../../movement/src/movement";
import { BaseSprite } from "../../objects";
import { Location } from "../../objects/contracts/position";
import { Sprite } from "../../objects/contracts/sprite";
import { BaseGameObject } from "../../objects/src/game-object";

export class PlayerCharacter extends BaseGameObject {
  @cleanupOnDestroy
  public readonly position$: Observable<Location>;

  constructor(mouseClick$: Observable<Coordinates>, startLocation: Location, zoom$: Observable<number>) {
    const sprite = PlayerCharacter.createCharacterSprite();
    super(sprite, { description: "The main character of the game!" }, startLocation);
    this.position$ = this.coordinateToLocation(mouseClick$, startLocation, zoom$);
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
        return move(mouseClick, zoom);
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
