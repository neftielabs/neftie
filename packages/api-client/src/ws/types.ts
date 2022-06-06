import type { Message } from "reconnecting-websocket";

import type { WsOpManifest } from "@neftie/common";

type ServerOpCodes = keyof WsOpManifest["server"];
type ClientOpCodes = keyof WsOpManifest["client"];

export type WsSend = <Op extends ClientOpCodes>(
  op: Op,
  data: WsOpManifest["client"][Op],
  ref?: string
) => void;

type RepliableOp<T> = T extends string
  ? `${T}:reply` extends ServerOpCodes
    ? T
    : never
  : never;

export type WsSendReplied = <Op extends RepliableOp<ClientOpCodes>>(
  op: Op,
  data: WsOpManifest["client"][Op],
  timeout?: number
) => Promise<WsOpManifest["server"][`${Op}:reply`]>;

export interface WsConnection {
  /**
   * Close the connection
   */
  close: () => void;

  /**
   * Listen for a given event/op
   */
  listenFor: <Op extends ServerOpCodes>(
    op: Op,
    handler: WsListenerHandler<Op>
  ) => () => void;

  /**
   * Sends a message to the server
   */
  send: WsSend;

  /**
   * Sends a binary message
   */
  sendBinary: (data: Message) => void;

  /**
   * Send a message and wait for a reply
   */
  sendReplied: WsSendReplied;
}

export type WsLogger = (
  direction: "in" | "out" | "warn",
  op: string,
  data?: unknown,
  message?: string
) => void;

export type CreateWsConnection = (
  token: string,
  options: {
    url: string;
    logger?: WsLogger;
    onClose?: () => void;
  }
) => Promise<WsConnection>;

export type WsListenerHandler<Op extends ServerOpCodes> = (
  data: WsOpManifest["server"][Op],
  ref?: string
) => void;

export type WsListener = {
  op: string;
  handler: WsListenerHandler<any>;
};

export type WsServerMessage<Data = unknown> = {
  d: Data;
  op: string;
  ref?: string;
};
