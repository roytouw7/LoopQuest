import { Observable } from "rxjs";
import { Destructable } from "../contracts/destructable";
import { PaneConfig } from "../contracts/pane-config";
import { TextAlign, TextConfig, VerticalTextAlign } from "../contracts/text-config";
import { cleanupOnDestroy } from "../decorators/cleanup-on-destroy";
import { BasePane } from "./base-pane";
import { Config } from "./config";

export abstract class TextPane extends BasePane implements Destructable {
  @cleanupOnDestroy
  private readonly text$: Observable<string>;
  private readonly textConfig?: TextConfig;

  constructor(config: PaneConfig, text$: Observable<string>, textConfig?: TextConfig) {
    super(config.width, config.height, config.x, config.y, config.backgroundColor, config.color);
    this.text$ = text$;
    this.textConfig = textConfig;
    this.setUpTextPane();
    this.drawText();
  }

  private setUpTextPane(): void {
    this.ctx.font = Config.defaultFont;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  private drawText(): void {
    let clear: () => void;

    this.text$.subscribe((text) => {
      if (clear) {
        clear();
      }

      clear = this.clearText(text);
      const metrics = this.ctx.measureText(text);
      this.ctx.fillStyle = this?.color?.hex ?? Config.defaultColor.hex;
      this.ctx.fillText(text, this.getHorizontalTextAlign(metrics), this.getVerticalTextAlign(metrics));
    });
  }

  private clearText(text: string): () => void {
    const metrics = this.ctx.measureText(text);
    return () => {
      this.ctx.clearRect(this.x, this.y, metrics.width, this.height);
      this.ctx.fillStyle = this?.backgroundColor?.hex ?? Config.defaultBackgroundColor.hex;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  }

  private getHorizontalTextAlign(metrics: TextMetrics): number {
    switch (this?.textConfig?.textAlign) {
      case TextAlign.CENTER:
        return (this.width - metrics.width) / 2 + this.x;
      case TextAlign.LEFT:
        return metrics.actualBoundingBoxLeft + this.x;
      case TextAlign.RIGHT:
        return this.width - metrics.width + this.x;
      default:
        return (this.width - metrics.width) / 2 + this.x;
    }
  }

  private getVerticalTextAlign(metrics: TextMetrics): number {
    switch (this?.textConfig?.verticalTextAlign) {
      case VerticalTextAlign.CENTER:
        return (this.height + metrics.actualBoundingBoxAscent) / 2 + this.y;
      case VerticalTextAlign.TOP:
        return metrics.actualBoundingBoxAscent + this.y;
      case VerticalTextAlign.BOTTOM:
        return this.height + metrics.actualBoundingBoxAscent + this.y;
      default:
        return metrics.actualBoundingBoxAscent + this.y;
    }
  }
}
