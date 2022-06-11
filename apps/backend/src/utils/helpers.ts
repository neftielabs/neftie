import type { OffsetPaginated, Paginated } from "@neftie/common";
import type { Result, ResultError } from "types/helpers";

/**
 * Inject cursor-based pagination data into a response object
 * based on the items being sent
 */
export const withPagination = <T>(
  items: T[],
  pagination: { cursor: keyof T | (keyof T)[]; limit: number }
): Paginated<T[]> => {
  const { cursor, limit } = pagination;

  if (!items.length || items.length < limit) {
    return {
      items,
    };
  }

  // Extract last field value
  let nextCursor: any = null;

  if (Array.isArray(cursor)) {
    const values = cursor.map((c) => items[items.length - 1][c]);
    nextCursor = values.join("__");
  } else {
    nextCursor = items[items.length - 1][cursor];
  }

  if (
    nextCursor === undefined ||
    nextCursor === null ||
    typeof nextCursor !== "string"
  ) {
    return {
      items,
    };
  }

  return {
    items,
    meta: {
      cursor: nextCursor,
    },
  };
};

/**
 * Inject offset-based pagination data into a response object
 * based on the items being sent
 */
export const withOffsetPagination = <T>(
  items: T[],
  pagination: { page: number; limit: number }
): OffsetPaginated<T[]> => {
  const { page, limit } = pagination;

  if (!items.length || items.length < limit) {
    return {
      items,
    };
  }

  return {
    items,
    meta: {
      nextPage: page + 1,
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

/**
 * From a composed order id (that is listingId_orderId), extract
 * the numeric order id.
 */
export const splitOrderId = (orderId: string) => {
  const [listingId, stringOrderId] = orderId.split("_");

  return {
    id: Number(stringOrderId),
    composedId: orderId,
    listingId,
    stringOrderId,
  };
};
