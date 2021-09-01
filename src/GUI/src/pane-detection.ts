import { combineLatestWith, map, Observable, ReplaySubject, share } from "rxjs";
import { Coordinates } from "../../contracts";
import { Pane } from "../contracts";

export const getPaneDetectionStream = (
  mousePosition$: Observable<Coordinates>,
  panes$: Observable<Pane[]>
): Observable<Pane | null> => {
  return mousePosition$.pipe(
    combineLatestWith(panes$),
    map((set) => {
      const [mousePosition, panes] = set;
      const pane = panes.find((pane) => paneAtPosition(mousePosition, pane));

      return pane ? pane : null;
    }),
    share({ connector: () => new ReplaySubject(1) })
  );
};

const paneAtPosition = (position: Coordinates, pane: Pane): boolean => {
  if (!pane.clickTrough) {
    if (position.x > pane.x && position.x < pane.x + pane.width) {
      if (position.y > pane.y && position.y < pane.y + pane.height) {
        return true;
      }
    }
  }
  return false;
};
