import { Observable, startWith, tap } from "rxjs";
import { log } from "../../helper/logOperator";
import { getMapClickStream, getMapLocationStream } from "../../IO/src/detection";
import { BaseSprite } from "../../objects";
import { Location } from "../../objects/contracts/position";
import { Sprite } from "../../objects/contracts/sprite";
import { BaseGameObject } from "../../objects/src/game-object";

export class PlayerCharacter extends BaseGameObject {
  private readonly _position$: Observable<Location>;

  public get position$(): Observable<Location> {
    return this._position$;
  }

  /**
   * @todo character should consume the new mapClickStream, but mapClickStream requires perspective from character...?
   */
  constructor(startLocation: Location) {
    const sprite = PlayerCharacter.createCharacterSprite();
    super(sprite, { description: "The main character of the game!" }, startLocation);
    console.log("creating character");
    this._position$ = getMapLocationStream(startLocation, getMapClickStream()).pipe(
      tap((location) => (this.location = location)),
      startWith(startLocation)
    );
  }

  private static createCharacterSprite(): Sprite {
    return new BaseSprite(Symbol("character"), { height: 100, width: 100, url: "/assets/saphire-amulet.png" });
  }
}
