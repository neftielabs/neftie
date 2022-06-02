import React, { useEffect, useMemo, useState } from "react";

import type { WsConnection } from "@neftie/api-client";
import { ws } from "@neftie/api-client";
import { useToken } from "hooks/useToken";
import { WS_BASEURL } from "lib/constants/app";
import { logger } from "lib/logger/instance";

export const WebSocketContext = React.createContext<{
  conn: WsConnection | null;
  isConnecting: boolean;
}>({
  conn: null,
  isConnecting: false,
});

interface WebSocketProviderProps {
  noWebSocket: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  noWebSocket,
}) => {
  const [token] = useToken();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connection, setConnection] = useState<WsConnection | null>(null);

  useEffect(() => {
    if (!noWebSocket && !connection && !isConnecting && !!token) {
      setIsConnecting(true);

      ws.createWsConnection(token!.value, {
        url: WS_BASEURL,
        logger: (dir, op, data) =>
          logger.debug(`[ws - ${dir}] [${op}]`, { data }),
      })
        .then((c) => {
          setConnection(c);
        })
        .finally(() => {
          setIsConnecting(false);
        });
    } else if (!token && connection) {
      connection.close();
      setConnection(null);
    }
  }, [token, noWebSocket, connection, isConnecting]);

  return (
    <WebSocketContext.Provider
      value={useMemo(
        () => ({
          conn: connection,
          isConnecting,
        }),
        [connection, isConnecting]
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
