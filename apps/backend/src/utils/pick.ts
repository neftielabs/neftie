/**
 * Picks properties from an object and returns the newly created one.
 *
 * @see https://stackoverflow.com/a/56593059/10831896
 */
export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  // eslint-disable-next-line no-sequences
  return keys.reduce((acum, key: K) => ((acum[key] = obj[key]), acum), {} as T);
};
