import { Observable } from "rxjs";

export interface Destructable {
  readonly destroy$: Observable<void>;
  destruct(): void;
}
