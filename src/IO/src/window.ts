import { debounceTime, fromEvent, map, Observable, shareReplay, startWith } from "rxjs";
import { WindowSize } from "../contracts";


const createWindowSizeStreamFunction = (): (() => Observable<WindowSize>) => {
  const windowSize$ = fromEvent(window, "resize").pipe(
    map((event: any) => {
      return {
        width: event.target.innerWidth,
        height: event.target.innerHeight,
      };
    }),
    startWith({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    debounceTime(250),
    shareReplay(1)
  );

  return (): Observable<WindowSize> => {
    return windowSize$;
  };
};

export const getWindowSize = createWindowSizeStreamFunction();