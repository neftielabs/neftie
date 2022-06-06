import WebSocket from "isomorphic-ws";
import type { Message } from "reconnecting-websocket";
import ReconnectingWebsocket from "reconnecting-websocket";
import { v4 as uuidv4 } from "uuid";

import { validateIncomingWsMessage } from "../utils";
import type {
  CreateWsConnection,
  WsConnection,
  WsListener,
  WsSend,
  WsServerMessage,
} from "./types";

// Constants

const CONNECTION_TIMEOUT = 15 * 1000;

/**
 * Establish a new authenticated websocket connection
 * with the server.
 *
 * @param token - The access token
 * @param options - Connection options
 */
export const createWsConnection: CreateWsConnection = (token, options) =>
  new Promise((resolve) => {
    const { url, logger = () => {}, onClose } = options;

    const ws = new ReconnectingWebsocket(url, [], {
      WebSocket,
      connectionTimeout: CONNECTION_TIMEOUT,
    });

    /**
     * Sends a message matching the op and expected data
     * according to the manifest.
     *
     * @param op - The op code
     * @param d - The data to include in the message
     */
    const wsSend: WsSend = (op, d, ref) => {
      if (ws.readyState !== ws.OPEN) {
        logger("warn", op, `Connection not open (${ws.readyState})`);
        return;
      }

      const message = JSON.stringify({ op, d, ...(ref ? { ref } : {}) });
      ws.send(message);

      logger("out", op, d, message);
    };

    /**
     * Max timeout to terminate the connection
     */
    let pingTimeout: NodeJS.Timeout | null = null;

    /**
     * Closes the connection if the server is unable
     * to reply to pings
     */
    const heartbeat = () => {
      if (pingTimeout) clearTimeout(pingTimeout);

      pingTimeout = setTimeout(() => {
        ws.close();
      }, 10 * 1000 + 2000);
    };

    /**
     * Listens for the `open` event. Automatically attempts auth and
     * sends a ping on a specified interval.
     */
    ws.addEventListener("open", () => {
      heartbeat();
      wsSend("auth", { token });
    });

    /**
     * Listens for the `close` event and acts upon
     * each error code (as per RFC 6455).
     * @see https://datatracker.ietf.org/doc/html/rfc6455#section-7.3
     */
    ws.addEventListener("close", (error) => {
      logger("warn", "WS_CLOSE_EVENT", error);
      ws.close();
      onClose?.();
    });

    /**
     * Array of listeners waiting for a server reply
     */
    const listeners: WsListener[] = [];

    /**
     * Listens for the `message` event. Won't resolve the promise
     * until the auth response is received.
     */
    ws.addEventListener("message", (event) => {
      /**
       * Filter out ping/pong messages
       */
      if (["ping", '"ping"'].includes(event.data)) {
        heartbeat();
        // logger("in", "ping");
        ws.send("pong");
        // logger("out", "pong");
        return;
      }

      let message: WsServerMessage | null = null;

      try {
        message = validateIncomingWsMessage(JSON.parse(event.data));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }

      if (!message) {
        logger("warn", "IN_MESSAGE_PARSE_ERROR", event.data);
        return;
      }

      /**
       * Handle auth reply by resolving to the connection
       * object.
       */
      if (message.op === "auth:reply") {
        const wsConnection: WsConnection = {
          // Close connection
          close: () => ws.close(),
          // Send a regular message
          send: wsSend,
          // Send a message in binary
          sendBinary: (data: Message) => {
            ws.binaryType = "arraybuffer";
            ws.send(data);
            ws.binaryType = "blob";
          },
          // Listen for an incoming message
          listenFor: (op, handler) => {
            const listener = { op, handler };
            listeners.push(listener);

            return () => listeners.splice(listeners.indexOf(listener), 1);
          },
          // Send a message and wait for a reply
          sendReplied: (op, params, timeout) =>
            new Promise((resolveSend, rejectSend) => {
              if (ws.readyState !== ws.OPEN) {
                rejectSend(new Error("WebSocket not connected"));
                return;
              }

              const ref = uuidv4();
              let timeoutId: NodeJS.Timeout | null = null;

              const unsubscribe = wsConnection.listenFor(
                `${op}:reply`,
                (data, replyRef) => {
                  if (replyRef !== ref) return;

                  if (timeoutId) clearTimeout(timeoutId);

                  unsubscribe();
                  resolveSend(data);
                }
              );

              if (timeout) {
                timeoutId = setTimeout(() => {
                  unsubscribe();
                  rejectSend(new Error("Request timed out"));
                }, timeout);
              }

              wsSend(op, params, ref);
            }),
        };

        resolve(wsConnection);
        return;
      }

      /**
       * Call the listener handler
       */

      listeners
        .filter(({ op }) => message?.op === op)
        .forEach((l) => l.handler(message!.d, message!.ref));
    });
  });
