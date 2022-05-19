import { Paginated } from "@neftie/common";

export const withPagination = <T>(
  items: T[],
  pagination: { cursor: keyof T; limit: number }
): Paginated<T[]> => {
  const { cursor, limit } = pagination;

  if (!items.length || items.length < limit) {
    return {
      items,
    };
  }

  // Extract last field value

  const lastValue = items[items.length - 1][cursor];

  if (
    lastValue === undefined ||
    lastValue === null ||
    typeof lastValue !== "string"
  ) {
    return {
      items,
    };
  }

  return {
    items,
    meta: {
      cursor: lastValue,
    },
  };
};
