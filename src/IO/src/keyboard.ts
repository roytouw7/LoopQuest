import { fromEvent } from "rxjs";

export const getKeyboardStream = () => {
  return fromEvent<KeyboardEvent>(document, "keydown");
};
