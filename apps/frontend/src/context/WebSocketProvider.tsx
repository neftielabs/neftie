import React, { useEffect, useMemo, useState } from "react";

import type { WsConnection } from "@neftie/api-client";
import { ws } from "@neftie/api-client";
import { useToken } from "hooks/useToken";
import { WS_BASEURL } from "lib/constants/app";
import { logger } from "lib/logger/instance";

export const WebSocketContext = React.createContext<{
  conn?: WsConnection;
  isConnecting: boolean;
}>({
  isConnecting: false,
});

interface WebSocketProviderProps {
  needsWebSocket: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  needsWebSocket,
}) => {
  const [token] = useToken();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connection, setConnection] = useState<WsConnection>();

  useEffect(() => {
    if (needsWebSocket && !connection && !isConnecting && token) {
      ws.createWsConnection(token.value, {
        url: WS_BASEURL,
        logger: (dir, op, data) =>
          logger.debug(`[ws - ${dir}] [${op}]`, { data }),
      })
        .then((c) => setConnection(c))
        .finally(() => setIsConnecting(false));
    }

    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, [connection, isConnecting, needsWebSocket, token]);

  return (
    <WebSocketContext.Provider
      value={useMemo(
        () => ({
          isConnecting,
          conn: connection,
        }),
        [connection, isConnecting]
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
