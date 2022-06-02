import type { WsServerMessage } from "./ws/types";

/**
 * Build a url with route params
 */
export const parseRouteParams = (
  url: string,
  routeParams: Record<string, string>
) => {
  let result = url;

  // eslint-disable-next-line guard-for-in
  for (const paramName in routeParams) {
    result = result.replace(`:${paramName}`, routeParams[paramName]);
  }

  return result;
};

/**
 * Verify that a received ws messages matches the
 * required schema.
 */
export const validateIncomingWsMessage = (
  message: any
): WsServerMessage | null => {
  if (message.d !== undefined && message.op !== undefined) {
    return message as WsServerMessage;
  }

  return null;
};
