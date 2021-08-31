import { mapTo, Observable, tap } from "rxjs";
import { getWindowSize } from "./window";

export const getGUICanvas = (): HTMLCanvasElement => document.getElementById("gui-canvas") as HTMLCanvasElement;

export const getCanvas = (): HTMLCanvasElement => document.getElementById("canvas") as HTMLCanvasElement;

export const getGUICtx = (): CanvasRenderingContext2D => {
  const ctx = getGUICanvas().getContext("2d");
  if (!ctx) {
    throw new Error("Could not fetch 2d context of canvas!");
  }
  return ctx;
};

export const getCtx = (): CanvasRenderingContext2D => {
  const ctx = getCanvas().getContext("2d");
  if (!ctx) {
    throw new Error("Could not fetch 2d context of canvas!");
  }
  return ctx;
};

export const setCanvasFullScreen = (): Observable<void> => {
  return getWindowSize().pipe(
    tap((windowSize) => {
      getGUICanvas().width = windowSize.width;
      getGUICanvas().height = windowSize.height;
      getCanvas().width = windowSize.width;
      getCanvas().height = windowSize.height;
      getCtx().imageSmoothingEnabled = true;
      getCtx().imageSmoothingQuality = "high";

      getCanvas().oncontextmenu = (e) => preventDefault(e);
      getGUICanvas().oncontextmenu = (e) => preventDefault(e);
    }),
    mapTo(void 0)
  );
};

const preventDefault = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const clearCanvas = (): void => {
  const { width, height } = getCanvas();
  getCtx().clearRect(0, 0, width, height);
};
