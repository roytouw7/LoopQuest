import { Observable, Subject, Subscription } from "rxjs";
import { getGUICanvas, getGUICtx } from "../../IO/src";
import { Destructable } from "../contracts/destructable";
import { GUIColor } from "../contracts/gui-color";
import { Pane } from "../contracts/pane";
import { Config } from "./config";
import { v4 as uuid } from "uuid";
import { WindowSize } from "../contracts";
import { getWindowSize } from "../../IO/src/window";
import { cleanupOnDestroy } from "../decorators/cleanup-on-destroy";

export abstract class BasePane implements Pane, Destructable {
  @cleanupOnDestroy
  protected readonly windowSize$: Observable<WindowSize>;
  public readonly id: string;
  protected readonly canvas: HTMLCanvasElement;
  protected readonly ctx: CanvasRenderingContext2D;
  protected readonly subscriptions: Subscription[] = [];
  private readonly _destroy$: Subject<void> = new Subject<void>();
  _width: number;
  private _height: number;
  private _x: number;
  private _y: number;
  backgroundColor?: GUIColor;
  color?: GUIColor;

  public get x(): number {
    return (this._x * this.canvas.width) / 100;
  }

  public get y(): number {
    return (this._y * this.canvas.height) / 100;
  }

  public get width(): number {
    return (this._width * this.canvas.width) / 100;
  }

  public get height(): number {
    return (this._height * this.canvas.height) / 100;
  }

  public get destroy$(): Observable<void> {
    return this._destroy$.asObservable();
  }

  constructor(width: number, height: number, x: number, y: number, backgroundColor?: GUIColor, color?: GUIColor) {
    this.id = uuid();
    this.canvas = getGUICanvas();
    this.ctx = getGUICtx();
    this._width = width;
    this._height = height;
    this._x = x;
    this._y = y;
    this.backgroundColor = backgroundColor ?? Config.defaultBackgroundColor;
    this.color = color ?? Config.defaultColor;
    this.windowSize$ = getWindowSize();
    this.setUpPane();
  }

  public drawPane(): void {
    this.ctx.fillStyle = this.backgroundColor?.hex ?? Config.defaultBackgroundColor.hex;
    this.ctx.rect(this.x, this.y, this.width, this.height);
  }

  public destruct(): void {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setUpPane(): void {
    if (this.color) {
      console.log("drawing basepane");
      this.ctx.fillStyle = this?.backgroundColor?.hex ?? Config.defaultBackgroundColor.hex;
    }
  }
}
