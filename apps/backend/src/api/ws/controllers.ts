import { areAddressesEqual, authSchema, orderSchema } from "@neftie/common";
import { orderService, tokenService } from "api/services";
import { prisma } from "config/database";
import { config } from "config/main";
import logger from "modules/Logger/Logger";
import { createWsController } from "modules/websocket/helpers";

/**
 * Connection healthcheck
 */
export const ping = createWsController("ping", (ctx) => {
  ctx.ws.send("pong", "pong");
});

/**
 * Auth controller. If this doesn't succeed, no client will
 * be added to the pool.
 */
export const auth = createWsController(
  "auth",
  authSchema.wsAuthMessage,
  async (ctx) => {
    const { token } = ctx.message.d;

    try {
      const tokenPayload = await tokenService.verifyAccessToken(token);

      if (
        !!tokenPayload.userId &&
        Number(tokenPayload.version) === config.tokens.access.currentVersion
      ) {
        ctx.clients.setAuthenticated({ userId: tokenPayload.userId, token });
        ctx.ws.send("auth:reply", { success: true });
      }
    } catch (error) {
      logger.debug(error);

      ctx.ws.send("auth:reply", {
        success: false,
      });
    }
  }
);

/**
 * Send an order message to another user
 */
export const sendOrderMessage = createWsController(
  "order_message",
  orderSchema.orderMessage,
  async (ctx) => {
    const { orderComposedId, message } = ctx.message.d;
    const { userId } = ctx.auth;

    const order = await orderService.getUserOrder({
      userId,
      composedId: orderComposedId,
    });

    if (
      !order ||
      (!areAddressesEqual(order.client.id, userId) &&
        !areAddressesEqual(order.seller.id, userId))
    ) {
      return;
    }

    const messageEvent = await prisma.orderMessage.create({
      data: {
        orderComposedId,
        message,
        senderId: ctx.auth.userId,
      },
    });

    // Broadcast message to both seller and client

    ctx.clients.broadcast(
      "order_event",
      {
        orderComposedId,
        event: {
          type: "message",
          from: order.isSeller ? "seller" : "client",
          message: messageEvent.message,
          timestamp: String(messageEvent.timestamp.getTime() / 1000),
        },
      },
      order.client.id,
      order.seller.id
    );
  }
);
