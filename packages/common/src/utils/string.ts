/**
 * Capitalizes first letters of words in string.
 * @param str - String to be modified
 * @param lower - Whether all other letters should be lowercased
 * @example
 *   capitalize('fix this string');     //  'Fix This String'
 *   capitalize('javaSCrIPT');          //  'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    //  'Javascript'
 * @see https://stackoverflow.com/a/7592235
 */
export const capitalize = <T extends string>(
  str: T,
  lower = false
): Capitalize<Lowercase<T>> =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  ) as Capitalize<Lowercase<T>>;
