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
  "/listings/:listingId/orders/verify",
  "get",
  (route) =>
    route
      .use(authMiddleware.withAuth("required"))
      .use(withQuery(orderSchema.verifyOrderSchema))
      .handler(async (ctx) => {
        const orderExists = await orderService.onChainOrderExists({
          clientId: ctx.auth.userId,
          listingId: ctx.routeParams.listingId,
          txHash: ctx.query.txHash,
        });

        if (isError(orderExists)) {
          return Response.notFound();
        }

        return Response.ok(orderExists.data);
      })
);

/**
 * Get all orders from a user (paginated)
 * Since orders can have confidential information, such as
 * chats, we only return the orders from the currently authenticated
 * user.
 */
export const getUserOrders = createController("/me/orders", "get", (route) =>
  route
    .use(authMiddleware.withAuth("required"))
    .use(withQuery(orderSchema.entityOrdersSchema))
    .use(filterMiddleware.pagination)
    .handler(async (ctx) => {
      const entity = ctx.query.as as "seller" | "client";
      const orders = await orderService.getUserOrders({
        entity,
        userId: ctx.auth.userId,
        pagination: ctx.filters.pagination,
      });

      return Response.ok(
        withPagination(orders, {
          cursor: "id",
          limit: ctx.filters.pagination.limit,
        })
      );
    })
);

/**
 * Get an order from a user.
 * Same as /me/orders, only an order from the authenticated user
 */
export const getUserOrder = createController(
  "/me/orders/:composedOrderId",
  "get",
  (route) =>
    route.use(authMiddleware.withAuth("required")).handler(async (ctx) => {
      const order = await orderService.getUserOrder({
        userId: ctx.auth.userId,
        composedId: ctx.routeParams.composedOrderId,
      });

      if (!order) {
        return Response.notFound();
      }

      return Response.ok(order);
    })
);
