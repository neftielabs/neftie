import type { Paginated } from "@neftie/common";
import type { Result, ResultError } from "types/helpers";

/**
 * Inject pagination data into a response object
 * based on the items being sent
 */
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

/**
 * Determine if a function return the `Result` type
 * has a false `success` property
 */
export const isError = <D, E>(
  result: Result<D, E>
): result is ResultError<E> => {
  return !result.success;
};

/**
 * Determine if a function returning the `Result` type
 * has errored with a certain error
 */
export const isErrorResult = <D, E>(result: Result<D, E>, error: E) => {
  return !result.success && "error" in result && result.error === error;
};
