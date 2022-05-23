import type { Asserts } from "yup";

import type { orderSchema } from "@neftie/common";

import type { Call } from "../types";

export const orderMethods = (call: Call) => ({
  mutation: {},
  query: {
    verifyOrderPlaced: (
      address: string,
      data: Asserts<typeof orderSchema["verifyOrderSchema"]>
    ) =>
      call("/orders/listing/:address/verify", "get", {
        params: data,
        realUrl: `/orders/listing/${address}/verify`,
      }),
  },
});
