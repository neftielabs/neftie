import Logger from "modules/Logger/Logger";
import morgan, { StreamOptions } from "morgan";
import { isProd } from "utils/constants";

/**
 * Overrides the stream method by
 * using winston console transport
 */
const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

/**
 * Middleware that will log all inbound traffic
 * to our API. This includes IP, method, url, user agent,
 * response code, among others.
 */
export const loggingMiddleware = morgan(isProd ? "combined" : "dev", {
  stream,
});
