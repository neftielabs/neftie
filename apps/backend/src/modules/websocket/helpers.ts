import type stream from "stream";

import type { AnyObjectSchema } from "yup";

import logger from "modules/Logger/Logger";
import type {
  WsClientOpCodes,
  WsControllerContext,
  WsControllerDispatcher,
} from "types/ws";

/**
 * Terminate an incoming socket request with
 * an http response. Default is `400 Bad Request`
 */
export const destroySocket = (socket: stream.Duplex, message: string) => {
  socket.end(`HTTP/1.1 ${message}\r\n\r\n`);
};

/**
 * Allows for the creation of a new controller
 * that will receive all context regarding the incoming
 * websocket message.
 */
export function createWsController<Op extends WsClientOpCodes>(
  op: Op,
  dataSchema: AnyObjectSchema,
  cb: (ctx: WsControllerContext<Op>) => void | Promise<void>
): WsControllerDispatcher;
export function createWsController<Op extends WsClientOpCodes>(
  op: Op,
  cb: (ctx: WsControllerContext<Op>) => void | Promise<void>
): WsControllerDispatcher;
export function createWsController<Op extends WsClientOpCodes>(
  op: Op,
  dataSchemaOrCb:
    | AnyObjectSchema
    | ((ctx: WsControllerContext<Op>) => void | Promise<void>),
  possibleCb?: (ctx: WsControllerContext<Op>) => void | Promise<void>
): WsControllerDispatcher {
  return (ctx) => {
    if (op !== ctx.message.op) {
      const error = new Error(
        `[ws] Mismatch in controller op (${op} vs ${ctx.message.op})`
      );
      logger.warn(error);
      throw error;
    }

    if (dataSchemaOrCb instanceof Function) {
      const cb = dataSchemaOrCb;
      return cb(ctx as any);
    }

    // Validate body

    const schema = dataSchemaOrCb;
    const cb = possibleCb!;

    return schema
      .validate(ctx.message.d, {
        stripUnknown: true,
      })
      .then((valid) =>
        cb({
          ...ctx,
          message: {
            ...ctx.message,
            d: valid,
          },
        } as any)
      )
      .catch((err) => {
        logger.debug(err);
        const errorMessage = err.errors.join(", ");
        ctx.ws.close(4000, errorMessage);
      });
  };
}
