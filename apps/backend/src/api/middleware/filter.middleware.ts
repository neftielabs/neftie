import { Middleware } from "typera-express";

import type { OffsetPagination, Pagination } from "types/helpers";

type Filters<P = Pagination> = {
  pagination: P;
};

/**
 * Cursor based pagination middleware.
 *
 * On paginated endpoints, the client receives a an object named `meta`
 * with the next cursor to use
 */
export const pagination: Middleware.Middleware<{ filters: Filters }, never> = (
  ctx
) => {
  const { cursor, limit } = ctx.req.query;

  let parsedLimit = 8;
  let parsedCursor = "";

  if (limit && typeof limit === "string" && !isNaN(parseInt(limit))) {
    parsedLimit = parseInt(limit);
  }

  if (cursor && typeof cursor === "string") {
    parsedCursor = cursor;
  }

  return Middleware.next({
    filters: {
      pagination: {
        cursor: parsedCursor,
        limit: parsedLimit,
      },
    },
  });
};

/**
 * Offset based pagination middleware.
 *
 * The client receives a `meta` object with the next page to
 * number.
 */
export const offsetPagination: Middleware.Middleware<
  { filters: Filters<OffsetPagination> },
  never
> = (ctx) => {
  const { page, limit } = ctx.req.query;

  let parsedLimit = 8;
  let parsedPage = 0;

  if (limit && typeof limit === "string" && !isNaN(parseInt(limit))) {
    parsedLimit = parseInt(limit);
  }

  if (page && typeof page === "string" && !isNaN(parseInt(page))) {
    parsedPage = parseInt(page);
  }

  return Middleware.next({
    filters: {
      pagination: {
        limit: parsedLimit,
        page: parsedPage,
        skip: parsedPage * parsedLimit,
      },
    },
  });
};
