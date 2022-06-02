/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import * as ws from "ws";

import type { WsAuthContext, WsSendWrapper } from "types/ws";

declare module "ws" {
  export interface WebSocket {
    isAlive: boolean;
    auth: WsAuthContext | null;
    safeSend: WsSendWrapper;
  }
}
