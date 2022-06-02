import React from "react";

import { WebSocketContext } from "context/WebSocketProvider";

export const useWs = () => React.useContext(WebSocketContext);
