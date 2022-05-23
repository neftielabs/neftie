import { Response } from "typera-express";

import { orderSchema } from "@neftie/common";
import { authMiddleware, filterMiddleware } from "api/middleware";
import { withQuery } from "api/middleware/validation.middleware";
import { orderService } from "api/services";
import { createController } from "modules/controller";
import { isError, withPagination } from "utils/helpers";

/**
 * Verify an order is available in the subgraph
 * by querying it by its transaction hash and client id
 */
export const verifyOrderExists = createController(
  "/orders/listing/:address/verify",
  "get",
  (route) =>
    route
      .use(authMiddleware.withAuth("required"))
      .use(withQuery(orderSchema.verifyOrderSchema))
      .handler(async (ctx) => {
        const orderExists = await orderService.onChainOrderExists({
          clientAddress: ctx.auth.userAddress,
          listingId: ctx.routeParams.address,
          txHash: ctx.query.txHash,
        });

        if (isError(orderExists)) {
          return Response.notFound();
        }

        return Response.ok();
      })
);

/**
 * Get all seller orders (paginated)
 */
export const getSellerOrders = createController(
  "/orders/user/:address",
  "get",
  (route) =>
    route
      .use(authMiddleware.withAuth("required"))
      .use(withQuery(orderSchema.userOrdersSchema))
      .use(filterMiddleware.pagination)
      .handler((ctx) => {
        const role = ctx.query.role as "seller" | "client";

        return Response.ok(
          withPagination([], {
            cursor: "",
            limit: ctx.filters.pagination.limit,
          })
        );
      })
);
