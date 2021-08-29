import { SpriteConfig } from "./sprite-config";

export interface Sprite {
  identifier: string | Symbol;
  spriteConfig: SpriteConfig;
  img: HTMLImageElement;
}
