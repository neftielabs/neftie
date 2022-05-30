import WebSocket from "isomorphic-ws";
import ReconnectingWebsocket from "reconnecting-websocket";

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
const PING_INTERVAL = 10 * 1000;

/**
 * Establish a new authenticated websocket connection
 * with the server.
 *
 * @param token - The access token
 * @param options - Connection options
 */
export const createWsConnection: CreateWsConnection = (token, options) =>
  new Promise((resolve) => {
    const {
      url,
      logger = () => {},
      onUnauthorized,
      onNotFound,
      onBadRequest,
      onError,
    } = options;

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
    const wsSend: WsSend = (op, d) => {
      if (ws.readyState !== ws.OPEN) {
        logger("warn", op, `Connection not open (${ws.readyState})`);
        return;
      }

      const message = JSON.stringify({ op, d });
      ws.send(message);

      logger("out", op, d, message);
    };

    /**
     * Listens for the `open` event. Automatically attempts auth and
     * sends a ping on a specified interval.
     */
    ws.addEventListener("open", () => {
      const intervalId = setInterval(() => {
        if (ws.readyState === ws.CLOSED) {
          clearInterval(intervalId);
          return;
        }

        wsSend("ping", {});
      }, PING_INTERVAL);

      wsSend("auth", { token });
    });

    /**
     * Listens for the `close` event and acts upon
     * each error code (as per RFC 6455).
     * @see https://datatracker.ietf.org/doc/html/rfc6455#section-7.3
     */
    ws.addEventListener("close", (error) => {
      logger("warn", "WS_CLOSE_EVENT", error);

      switch (error.code) {
        case 4001:
          // Connection must be authenticated, so we
          // close it no matter what.
          ws.close();
          onUnauthorized?.();
          break;
        case 4004:
          onNotFound?.(ws);
          break;
        case 4000:
          onBadRequest?.(ws);
          break;
        default:
          onError?.(ws);
      }
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
       * Filter out ping/pong messages
       */
      if (message.op === "pong") {
        logger("in", "pong");
        return;
      }

      /**
       * Handle auth reply by resolving to the connection
       * object.
       */
      if (message.op === "auth:reply") {
        const wsConnection: WsConnection = {
          close: () => ws.close(),
          send: wsSend,
          listenFor: (op, handler) => {
            const listener = { op, handler };
            listeners.push(listener);

            return () => listeners.splice(listeners.indexOf(listener), 1);
          },
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
