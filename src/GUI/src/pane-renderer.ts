import { interval, Observable, switchMapTo } from "rxjs";
import { Pane } from "../contracts";

export class PaneRenderer {
  private readonly pane$: Observable<Pane[]>;

  constructor(pane$: Observable<Pane[]>) {
    this.pane$ = pane$;
    this.drawPanes();
  }

  private drawPanes(): void {
    let references: Pane[] = [];
    interval(100)
      .pipe(switchMapTo(this.pane$))
      .subscribe((panes) => {
        references.forEach((ref) => ref.destruct());
        references = [];

        panes.forEach((pane) => {
          pane.drawPane();
          references.push(pane);
        });
      });
  }
}
