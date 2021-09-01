import { Coordinates } from "../../contracts";
import { getCanvas } from "../../IO";
import { Vector } from "../contracts/vector";

/**
 * Transform click on screen to relative vector movement
 */
export const transformProjectionLocationToRealDistance = (screenPosition: Coordinates, zoom: number): Vector => {
  const { width, height } = getCanvas();
  const [cX, cY] = [width / 2, height / 2];
  const { x, y } = screenPosition;

  const [dX, dY] = [x - cX, y - cY];
  const [aX, aY] = [dX * (1 / zoom), dY * -(1 / zoom)];

  return {
    dX: aX,
    dY: aY,
  };
};
