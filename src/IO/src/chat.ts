import { Observable, ReplaySubject, scan, share } from "rxjs";

export const keyboardInputToMessageStream = (source$: Observable<KeyboardEvent>): Observable<string> => {
  return source$.pipe(
    scan((acc, curr) => {
      if (curr.key === "Enter") {
        return "";
      } else if (curr.key === "Backspace") {
        return acc.slice(0, -1);
      } else if (isAllowedChatCharacter(curr)) {
        return `${acc}${curr.key}`;
      } else {
        return acc;
      }
    }, ""),
    share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: false })
  );
};

const isAllowedChatCharacter = (key: KeyboardEvent): boolean => {
  const allowedCharacters = /^([a-z]|[A-Z]|[ -@]){1}$/;
  return allowedCharacters.test(key.key);
};
