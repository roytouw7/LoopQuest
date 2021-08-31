import { Observable, ReplaySubject, share, Subject } from "rxjs";

interface Managable {
  readonly id: string;
}

interface ManagerInterface<T extends Managable> {
  registerObject: (object: T) => void;
  unregisterObject: (id: string) => T;
  object$: Observable<T[]>;
}

export class Manager<T extends Managable> implements ManagerInterface<T> {
  private readonly collection: T[] = [];
  private readonly _object$: Subject<T[]>;

  public get object$(): Observable<T[]> {
    return this._object$.pipe(share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false }));
  }

  constructor() {
    this._object$ = new Subject<T[]>();
  }

  registerObject(object: T): void {
    this.collection.push(object);
    this._object$.next(this.collection);
  }

  unregisterObject(id: string): T {
    const index = this.collection.findIndex((object) => object.id === id);
    if (!index) {
      throw new Error(`Object with ${id} not found in collection, could not be removed!`);
    }
    const removedItem = this.collection.splice(index, 1).pop();
    if (!removedItem) {
      throw new Error(`Object with ${id} not found in collection, could not be removed!`);
    }
    this._object$.next(this.collection);
    return removedItem;
  }
}
