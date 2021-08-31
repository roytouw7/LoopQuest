import { interval, map, Observable, of, switchMapTo, tap } from "rxjs";

export const log =
  <T>(tag: string, explicit = true) =>
  (source$: Observable<T>): Observable<T> => {
    return source$.pipe(
      tap((x) => {
        if (explicit) {
          console.log(`${tag}: ${JSON.stringify(x)}`);
        } else {
          console.log(`${tag}: ${x}`);
        }
      })
    );
  };
