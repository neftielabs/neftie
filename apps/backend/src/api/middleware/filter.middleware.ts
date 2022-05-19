import { Middleware } from "typera-express";
import { Pagination } from "types/helpers";

type Filters = {
  pagination: Pagination;
};

/**
 * Cursor based pagination middleware.
 *
 * On paginated endpoints, the client receives a an object named `url`
 * with the request response that includes `next`, `current`, `prev`.
 */
export const pagination: Middleware.Middleware<{ filters: Filters }, never> = (
  ctx
) => {
  const { cursor, limit } = ctx.req.query;

  let parsedLimit = 8;
  let parsedCursor: string | null = null;

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
