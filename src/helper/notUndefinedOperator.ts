export const isNotUndefined = <T>(input: T | undefined): input is T => {
  return input !== undefined;
};
