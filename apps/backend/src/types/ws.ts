import type { WebSocket } from "ws";

import type { WsOpManifest } from "@neftie/common";

export type WsClientManifestToMessage = {
  [K in keyof WsOpManifest["client"]]: {
    op: K;
    d: WsOpManifest["client"][K];
    ref?: string;
  };
};

export type WsAuthContext = {
  token: string;
  userId: string;
};

export type WsClients = Map<string, WebSocket>;

export type WsClientOpCodes = keyof WsOpManifest["client"];
export type WsServerOpCodes = keyof WsOpManifest["server"];

export type WsSendWrapper = <Op extends WsServerOpCodes>(
  op: Op,
  data: WsOpManifest["server"][Op],
  ref?: string
) => void;

export type WsBroadcast = <Op extends WsServerOpCodes>(
  op: Op,
  data: WsOpManifest["server"][Op],
  ...ids: string[]
) => void;

export type WsControllerContext<
  Op extends WsClientOpCodes,
  Auth = WsAuthContext
> = {
  message: WsClientManifestToMessage[Op];
  ws: Omit<WebSocket, "auth"> & { auth: Auth };
  clients: {
    remove: (close?: number) => void;
    broadcast: WsBroadcast;
    setAuthenticated: (auth: WsAuthContext) => void;
  };
};

export type WsControllerDispatcher = (
  ctx: WsControllerContext<WsClientOpCodes>
) => void;

export type WsController = <Op extends WsClientOpCodes>(
  op: Op,
  cb: (ctx: WsControllerContext<Op>) => void | Promise<void>
) => WsControllerDispatcher;
