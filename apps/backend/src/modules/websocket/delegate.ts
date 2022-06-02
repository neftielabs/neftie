/* eslint-disable camelcase */

import { tokenService } from "api/services";
import { wsControllers } from "api/ws";
import { config } from "config/main";
import logger from "modules/Logger/Logger";
import type {
  WsAuthContext,
  WsClientOpCodes,
  WsControllerContext,
  WsControllerDispatcher,
} from "types/ws";

/**
 * List of controllers
 */
const controllers: Record<WsClientOpCodes, WsControllerDispatcher> = {
  auth: wsControllers.auth,
  order_message: wsControllers.sendOrderMessage,
  new_order_action: wsControllers.checkOrderAction,
};

/**
 * Delegate each websocket message to their op handler
 */
export const delegateWsOp = async (
  ctx: WsControllerContext<WsClientOpCodes, WsAuthContext | null>
) => {
  if (!(ctx.message.op in controllers)) {
    return;
  }

  const { auth } = ctx.ws;

  /**
   * Deny access to non authenticated requests
   */

  if (!["auth", "ping"].includes(ctx.message.op) && !auth) {
    ctx.ws.close(4001);
    return;
  }

  /**
   * Validate access token
   */

  if (!["auth", "ping"].includes(ctx.message.op) && auth) {
    try {
      const tokenPayload = await tokenService.verifyAccessToken(auth.token);

      if (
        !tokenPayload.userId ||
        tokenPayload.userId !== auth.userId ||
        Number(tokenPayload.version) !== config.tokens.access.currentVersion
      ) {
        ctx.clients.remove(4001);
        return;
      }
    } catch (error) {
      logger.debug(error);
      ctx.clients.remove(4001);
      return;
    }
  }

  controllers[ctx.message.op](ctx as WsControllerContext<WsClientOpCodes>);
};
