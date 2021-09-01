import { Observable } from "rxjs";
import { Manager } from "../../controllers/src/manager";
import { Pane } from "../contracts";

/** @Singleton responsible for registering GUI Pane Objects */
export class PaneManager {
  private static instance: PaneManager;
  private readonly manager: Manager<Pane>;

  public get panes$(): Observable<Pane[]> {
    return this.manager.object$;
  }

  private constructor() {
    this.manager = new Manager<Pane>();
  }

  public static getInstance(): PaneManager {
    if (!PaneManager.instance) {
      PaneManager.instance = new PaneManager();
    }

    return PaneManager.instance;
  }

  public registerPane(pane: Pane): void {
    this.manager.registerObject(pane);
  }

  public unregisterPane(paneId: string): Pane {
    return this.manager.unregisterObject(paneId);
  }
}
