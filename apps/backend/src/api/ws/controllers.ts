import { fromBuffer as fileTypeFromBuffer } from "file-type";

import type { OrderEventType } from "@neftie/common";
import { authSchema, orderSchema } from "@neftie/common";
import { orderService, tokenService } from "api/services";
import { prisma } from "config/database";
import { config } from "config/main";
import { mediaBucket } from "modules/aws/s3-instances";
import logger from "modules/Logger/Logger";
import { createWsController } from "modules/websocket/helpers";
import { getMediaUrl } from "utils/url";

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
        ctx.ws.safeSend("auth:reply", { success: true });
      }
    } catch (error) {
      logger.debug(error);

      ctx.ws.safeSend("auth:reply", {
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
    const file = ctx.message.d.file as Buffer;
    const { userId } = ctx.ws.auth;

    const order = await orderService.getUserOrder({
      userId,
      composedId: orderComposedId,
    });

    if (!order || !orderService.is(order, userId, "some")) {
      return;
    }

    let mediaUri: string | null = null;

    if (file) {
      const fileType = await fileTypeFromBuffer(file);

      if (
        fileType &&
        ["jpg", "jpeg", "gif", "png"].includes(fileType.ext) &&
        fileType.mime.includes("image")
      ) {
        // Upload to S3
        const result = await mediaBucket.upload({
          file,
          directory: `o`,
          extension: fileType.ext,
        });

        if (result) {
          mediaUri = result.key;
        }
      }
    }

    const messageEvent = await prisma.orderMessage.create({
      data: {
        orderComposedId,
        message,
        senderId: ctx.ws.auth.userId,
        mediaUri,
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
          mediaUrl: getMediaUrl(messageEvent.mediaUri),
        },
      },
      order.client.id,
      order.seller.id
    );
  }
);

/**
 * Query a specific order action and wait for its
 * indexing
 */
export const checkOrderAction = createWsController(
  "new_order_action",
  orderSchema.newOrderAction,
  async (ctx) => {
    const {
      orderComposedId,
      action,
      timestamp = Math.round(Date.now() / 1000),
    } = ctx.message.d;
    const ref = ctx.message.ref;
    const { userId } = ctx.ws.auth;

    const order = await orderService.getUserOrder({
      userId,
      composedId: orderComposedId,
    });

    if (!order || !orderService.is(order, userId, "some")) {
      return;
    }

    const roleMap: Record<"seller" | "client" | "both", OrderEventType[]> = {
      seller: ["COMPLETED", "DELIVERED", "STARTED"],
      client: ["PLACED", "REVISION"],
      both: ["DISMISSED", "CANCELLED"],
    };

    if (
      (roleMap.seller.includes(action) &&
        orderService.is(order, userId, "seller")) ||
      (roleMap.seller.includes(action) &&
        orderService.is(order, userId, "client")) ||
      (roleMap.both.includes(action) && orderService.is(order, userId, "some"))
    ) {
      return await orderService
        .lookupOrderEvent({
          composedOrderId: orderComposedId,
          type: action,
          interval: 5000,
          maxRetries: 30,
          timestamps: [timestamp - 1000, timestamp + 1000],
        })
        .then((eventData) => {
          ctx.ws.safeSend("new_order_action:reply", { success: true }, ref);
          ctx.clients.broadcast(
            "order_event",
            {
              orderComposedId,
              event: {
                ...eventData,
                from: orderService.is(order, userId, "client")
                  ? "client"
                  : "seller",
              },
            },
            order.seller.id,
            order.client.id
          );
        })
        .catch((error) => {
          logger.warn(error);
        });
    }

    ctx.ws.safeSend("new_order_action:reply", { success: false }, ref);
  }
);
