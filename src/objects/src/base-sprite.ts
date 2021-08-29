import { getCtx } from "../../IO";
import { ScreenPosition } from "../../IO/contracts";
import { Sprite } from "../contracts/sprite";
import { SpriteConfig } from "../contracts/sprite-config";

export class BaseSprite implements Sprite {
  protected readonly ctx: CanvasRenderingContext2D;
  public readonly identifier: string | Symbol;
  public readonly spriteConfig: SpriteConfig;
  public img: HTMLImageElement = new Image();

  constructor(identifier: string | Symbol, spriteConfig: SpriteConfig) {
    this.ctx = getCtx();
    this.identifier = identifier;
    this.spriteConfig = spriteConfig;
    this.loadImage();
  }

  private loadImage(): void {
    this.img.src = this.spriteConfig.url;
  }

  /** @deprected projection logic => projection class */
  public drawSprite(position: ScreenPosition, zoom: number): void {
    const { width, height } = this.spriteConfig;
    const { x, y } = position;
    const adjustedWidth = this.adjustDimensionForZoom(width, zoom);
    const adjustedHeight = this.adjustDimensionForZoom(zoom, height);

    try {
      this.ctx.drawImage(this.img, x, y, adjustedWidth, adjustedHeight);
    } catch (e: unknown) {
      throw new Error(`Could not draw image ${this.spriteConfig.url} to context in BaseSprite`);
    }
  }

  /** @deprected projection logic => projection class */
  protected adjustDimensionForZoom(dimension: number, zoom: number): number {
    return dimension / 100 * (zoom * 10);
  }
}
