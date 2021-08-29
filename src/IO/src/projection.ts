import { Location } from "../../objects/contracts/position";
import { ProjectedLocation } from "../../objects/contracts/projected-location";
import { BaseGameObject } from "../../objects/src/game-object";
import { getCanvas, getCtx } from "./canvas";

/** Singleton; for projection on the canvas. */
export class Projection {
  private static instance: Projection;
  private readonly ctx = getCtx();

  private constructor() {}

  public static getInstance() {
    if (!Projection.instance) {
      Projection.instance = new Projection();
    }
    return Projection.instance;
  }

  public drawGameObject(object: BaseGameObject, perspective: Location, zoom: number): void {
    const { x, y } = object.location;
    const { img } = object.sprite;
    const { width, height } = object.sprite.spriteConfig;

    const relativeProjection = this.getRelativeProjection(perspective, x, y);
    const { pX, pY } = this.getAbsoluteProjection(relativeProjection);
    const { aX, aY } = this.adjustPositionForZoom(zoom, pX, pY);
    const [aWidth, aHeight] = this.adjustDimensionsForZoom(zoom, width, height);

    if (this.isVisible(aX, aY)) {
      this.ctx.drawImage(img, aX, aY, aWidth, aHeight);
    }
  }

  private getRelativeProjection(perspective: Location, x: number, y: number): ProjectedLocation {
    return {
      pX: x - perspective.x,
      pY: y - perspective.y,
    };
  }

  private getAbsoluteProjection(relativeProjection: ProjectedLocation): ProjectedLocation {
    const { width, height } = getCanvas();
    return {
      pX: width / 2 + relativeProjection.pX,
      pY: height / 2 - relativeProjection.pY,
    };
  }

  private adjustPositionForZoom(zoom: number, pX: number, pY: number): { aX: number; aY: number } {
    const { width, height } = getCanvas();
    const [cX, cY] = [width / 2, height / 2];

    const dX = (cX - pX) * (1 - zoom);
    const dY = (cY - pY) * (1 - zoom);

    const aX = dX + pX;
    const aY = dY + pY;

    return {
      aX,
      aY,
    };
  }

  private adjustDimensionsForZoom(zoom: number, width: number, height: number): number[] {
    const aWidth = zoom * width;
    const aHeight = zoom * height;

    return [aWidth, aHeight];
  }

  private isVisible(aX: number, aY: number): boolean {
    const { width, height } = getCanvas();
    return aX <= width && aY <= height;
  }
}
