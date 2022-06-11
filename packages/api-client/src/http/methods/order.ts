import type { Asserts } from "yup";

import type { orderSchema } from "@neftie/common";

import type { Call } from "../types";

export const orderMethods = (call: Call) => ({
  mutation: {},
  query: {
    verifyOrderPlaced: (
      listingId: string,
      data: Asserts<typeof orderSchema["verifyOrderSchema"]>
    ) =>
      call("/listings/:listingId/orders/verify", "get", {
        params: data,
        routeParams: {
          listingId,
        },
      }),

    getMyOrders: (
      data: Asserts<typeof orderSchema["entityOrdersSchema"]> & {
        pageParam?: string;
      }
    ) =>
      call("/me/orders", "get", {
        params: {
          page: data.pageParam,
          as: data.as.toLowerCase(),
        },
      }),

    getMyOrder: (composedOrderId: string) =>
      call("/me/orders/:composedOrderId", "get", {
        routeParams: {
          composedOrderId,
        },
      }),
  },
});
