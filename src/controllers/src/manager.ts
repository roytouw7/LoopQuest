import { Observable, ReplaySubject } from "rxjs";

interface Managable<T> {
  readonly id: string;
  children?: T[];
}

interface ManagerInterface<T extends Managable<T>> {
  registerObject: (object: T) => void;
  unregisterObject: (id: string) => T;
  object$: Observable<T[]>;
  count(): number;
}

export class Manager<T extends Managable<T>> implements ManagerInterface<T> {
  private readonly collection: T[] = [];
  private readonly _object$: ReplaySubject<T[]>;

  public get object$(): Observable<T[]> {
    return this._object$;
  }

  constructor() {
    this._object$ = new ReplaySubject<T[]>(1);
  }

  registerObject(object: T): void {
    this.collection.push(object);
    if (object.children) {
      this.registerChildrenRecursive(object.children);
    }
    this._object$.next(this.collection);
  }

  private registerChildrenRecursive(children: T[]): void {
    children.forEach((child) => {
      this.collection.push(child);
      if (child.children) {
        this.registerChildrenRecursive(child.children);
      }
    });
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

  count(): number {
    return this.collection.length;
  }
}
