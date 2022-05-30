import type { Server } from "http";

import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";

import { toChecksum } from "@neftie/common";
import logger from "modules/Logger/Logger";
import { delegateWsOp } from "modules/websocket/delegate";
import { destroySocket, wrappedWsSend } from "modules/websocket/helpers";
import type { WsAuthContext } from "types/ws";

/**
 * Initialize a new websocket server by tapping into
 * the http server instance and switching protocols
 * when needed
 */
export const createWebSocketServer = (server: Server) => {
  /**
   * Map of current connected ws clients
   * userId: ws
   */
  const clients: Map<string, WebSocket> = new Map();

  /**
   * The websocket server instance
   */
  const wss = new WebSocketServer({ noServer: true });

  /**
   * Converts addresses to checksum in order to avoid
   * casing mismatches when getting a client
   */
  const safeClients = (id: string) => {
    const safeId = toChecksum(id);

    return {
      get: () => clients.get(safeId),
      set: (ws: WebSocket) => clients.set(safeId, ws),
      delete: () => clients.delete(safeId),
    };
  };

  /**
   * If a ws connection comes in, delegate it to the
   * ws handler by emitting the connection event.
   */
  server.on("upgrade", (req, socket, head) => {
    if (req.headers.upgrade !== "websocket") {
      return destroySocket(socket, "400 Bad Request");
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  /**
   * Set up the event listeners and delegate the `message`
   * event to the appropriate handler
   */
  wss.on("connection", (ws) => {
    /**
     * Flag to tell if a client is authenticated.
     * All calls should be authenticated, except for the
     * `auth` op.
     */
    let auth: WsAuthContext | null = null;

    /**
     * Listen for the message event, parse it and delegate
     * to the controller.
     */
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.op && message.d !== undefined) {
          return delegateWsOp({
            auth,
            message,
            ws: {
              instance: ws,
              send: wrappedWsSend(ws),
            },
            clients: {
              getAll: () => clients,
              get: (id) => safeClients(id).get(),
              set: (id) => safeClients(id).set(ws),
              remove: (id, opts) => {
                auth = null;
                safeClients(id).delete();
                if (opts?.close) ws.close(opts.close);
              },
              broadcast: (op, d, ...ids) => {
                ids.forEach((id) => {
                  const client = safeClients(id).get();

                  if (client) {
                    wrappedWsSend(client)(op, d);
                  }
                });
              },
              setAuthenticated: (a) => {
                auth = a;
                safeClients(a.userId).set(ws);
              },
            },
          });
        }
      } catch (error) {
        logger.warn(error);
      }

      /**
       * Handle the close event.
       */
      ws.on("close", () => {
        if (auth) {
          safeClients(auth.userId).delete();
          auth = null;
        }
      });
    });
  });
};
