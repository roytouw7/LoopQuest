import { Observable, Subject, Subscription } from "rxjs";
import { v4 as uuid } from "uuid";
import { getGUICanvas, getGUICtx } from "../../IO/src";
import { getWindowSize } from "../../IO/src/window";
import { WindowSize } from "../contracts";
import { Destructable } from "../contracts/destructable";
import { GUIColor } from "../contracts/gui-color";
import { cleanupOnDestroy } from "../decorators/cleanup-on-destroy";
import { Config } from "./config";

export abstract class BasePane implements Destructable {
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

  public destruct(): void {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setUpPane(): void {
    if (this.color) {
      this.ctx.fillStyle = this?.backgroundColor?.hex ?? Config.defaultBackgroundColor.hex;
    }
  }
}
