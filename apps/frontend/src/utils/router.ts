export const isStringQueryParam = (
  param: string | string[] | undefined
): param is string => !!param && typeof param === "string";
