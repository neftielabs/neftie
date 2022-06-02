import type { Server } from "http";

import { WebSocketServer } from "ws";

import { toChecksum } from "@neftie/common";
import logger from "modules/Logger/Logger";
import { delegateWsOp } from "modules/websocket/delegate";
import { destroySocket } from "modules/websocket/helpers";

/**
 * Initialize a new websocket server by tapping into
 * the http server instance and switching protocols
 * when needed
 */
export const createWebSocketServer = (server: Server) => {
  /**
   * The websocket server instance
   */
  const wss = new WebSocketServer({ noServer: true });

  /**
   * Log connections in/out
   */
  const logConn = (
    dir: "open" | "closed",
    userId?: string,
    forced = false,
    extra = ""
  ) => {
    const color = dir === "open" ? "🟢" : "🔴";

    logger.debug(
      `[ws] ${color} Connection from ${userId?.slice(0, 10) ?? "?"} ${dir} ${
        forced ? "(forced)" : ""
      } ${extra}`
    );
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
      ws.auth = null;
      ws.isAlive = true;

      wss.emit("connection", ws, req);
    });
  });

  /**
   * Remove unused/old clients every 30s and send
   * a ping event to verify the connection is still alive.
   */
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        logConn("closed", ws.auth?.userId, true, "(not alive)");
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.send("ping");
    });
  }, 10 * 1000);

  /**
   * Clear the cleanup interval once the server connection
   * is closed.
   */
  wss.on("close", () => {
    logConn("closed", undefined, false, "(wss close event)");
    clearInterval(interval);
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
    ws.auth = null;

    /**
     * Type-safe send
     */
    ws.safeSend = (op, d, ref) => {
      ws.send(JSON.stringify({ op, d, ref }));
    };

    /**
     * Flag to tell if a client is alive
     */
    ws.isAlive = true;

    /**
     * Handle the close event.
     */
    ws.on("close", () => {
      logConn("closed", ws.auth?.userId, false, "(close event)");
    });

    /**
     * Listen for the message event, parse it and delegate
     * to the controller.
     */
    ws.on("message", (data) => {
      /**
       * Listen for the pong event (from the client) and keep
       * the connection alive
       */
      if (data.toString() === "pong") {
        ws.isAlive = true;
        return;
      }

      try {
        const message = JSON.parse(data.toString());

        if (message.op && message.d !== undefined) {
          return delegateWsOp({
            message,
            ws,
            clients: {
              remove: (close) => {
                logConn("closed", ws.auth?.userId, true, "(remove)");

                wss.clients.delete(ws);
                ws.close(close);
              },
              broadcast: (op, d, ...ids) => {
                const broadCastTo = ids.map((i) => toChecksum(i));

                wss.clients.forEach((client) => {
                  if (
                    client.auth?.userId &&
                    broadCastTo.includes(client.auth.userId)
                  ) {
                    client.safeSend(op, d);
                  }
                });
              },
              setAuthenticated: ({ userId, token }) => {
                ws.auth = {
                  token,
                  userId: toChecksum(userId),
                };

                logConn("open", userId, false, `(${wss.clients.size} clients)`);
              },
            },
          });
        }
      } catch (error) {
        logger.warn(error);
      }
    });
  });
};
