import { Coordinates } from "../../contracts";

export enum ClickEvent {
  LEFT = 1,
  RIGHT = 2,
  NONE = 0,
}

export interface MouseEvent {
  coordinates: Coordinates;
  click: ClickEvent;
}
