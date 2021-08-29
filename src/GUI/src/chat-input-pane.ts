import { Observable, scan } from "rxjs";
import { PaneConfig } from "../contracts";
import { TextAlign, TextConfig, VerticalTextAlign } from "../contracts/text-config";
import { TextPane } from "./text-pane";

export class ChatInputPane extends TextPane {
  constructor(chatInput$: Observable<KeyboardEvent>) {
    const config: PaneConfig = {
      width: 100,
      height: 5,
      x: 0,
      y: 95,
    };

    const textConfig: TextConfig = {
      textAlign: TextAlign.LEFT,
      verticalTextAlign: VerticalTextAlign.CENTER,
    };

    const message$ = ChatInputPane.keyboardInputToMessageStream(chatInput$);

    super(config, message$, textConfig);
  }

  private static keyboardInputToMessageStream(source$: Observable<KeyboardEvent>): Observable<string> {
    return source$.pipe(
      scan((acc, curr) => {
        if (curr.key === "Enter") {
          return "";
        } else if (curr.key === "Backspace") {
          return acc.slice(0, -1);
        } else if (ChatInputPane.isAllowedCharacter(curr)) {
          return `${acc}${curr.key}`;
        } else {
          return acc;
        }
      }, "")
    );
  }

  private static isAllowedCharacter(key: KeyboardEvent): boolean {
    const allowedCharacters = /^([a-z]|[A-Z]|[ -@]){1}$/;
    return allowedCharacters.test(key.key);
  }
}
