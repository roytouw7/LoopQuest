import { Observable, takeUntil } from "rxjs";

/** 
 * Adds takeUntil(this.destroy$) on observable.
 * Target class should implement Destructable interface.
 */
export function cleanupOnDestroy(target: any, key: string) {
  let val = target[key];

  const getter = function () {
    return val;
  };

  const setter = function (this: any, newVal: Observable<unknown>) {
    val = newVal.pipe(takeUntil(this.destroy$));
  };

  if (delete target[key]) {
    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
}
