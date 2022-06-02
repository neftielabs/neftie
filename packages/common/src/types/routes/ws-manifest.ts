/* eslint-disable @typescript-eslint/ban-types */

import type { Asserts } from "yup";

import type { authSchema, orderSchema } from "../../validation";
import type { IOrderEvent } from "../models";

/**
 * Collection of websocket op codes and the
 * expected message type.
 */
export type WsOpManifest = {
  server: {
    "auth:reply": {
      success: boolean;
    };

    order_event: {
      orderComposedId: string;
      event: IOrderEvent;
    };

    "new_order_action:reply": {
      success: boolean;
    };
  };
  client: {
    auth: Asserts<typeof authSchema["wsAuthMessage"]>;

    order_message: Asserts<typeof orderSchema["orderMessage"]>;

    new_order_action: Asserts<typeof orderSchema["newOrderAction"]>;
  };
};
