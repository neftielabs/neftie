/**
 * Typesafe alternative to `for(key in obj)` or
 * `Object.keys(obj)`, with the keys casted.
 */
export const typedObjectKeys = <T>(obj: T) => Object.keys(obj) as (keyof T)[];

/**
 * Checks if a date has expired
 */
export const isDateExpired = (expireDate: Date) => new Date() > expireDate;

/**
 * Returns a random number between a
 * given interval
 */
export const range = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
