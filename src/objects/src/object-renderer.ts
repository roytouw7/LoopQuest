import { interval, Observable, switchMapTo } from "rxjs";
import { combineLatestWith } from "rxjs/operators";
import { clearCanvas } from "../../IO";
import { Projection } from "../../IO/src/projection";
import { Location } from "../contracts/position";
import { ObjectManager } from "./object-manager";

export class ObjectRenderer {
  private readonly perspective$: Observable<Location>;
  private readonly zoom$: Observable<number>;
  private readonly projectionOutput: Projection;
  private readonly gameObjectManager: ObjectManager;

  constructor(perspective$: Observable<Location>, zoom$: Observable<number>) {
    this.perspective$ = perspective$;
    this.zoom$ = zoom$;
    this.gameObjectManager = ObjectManager.getInstance(perspective$);
    this.projectionOutput = Projection.getInstance();
    this.drawObjects();
  }

  private drawObjects(): void {
    interval(10)
      .pipe(switchMapTo(this.perspective$.pipe(combineLatestWith(this.zoom$, this.gameObjectManager.gameObjects$))))
      .subscribe((set) => {
        const [perspective, zoom, gameObjects] = set;
        clearCanvas();
        gameObjects.forEach((object) => this.projectionOutput.drawGameObject(object, perspective, zoom));
      });
  }
}
