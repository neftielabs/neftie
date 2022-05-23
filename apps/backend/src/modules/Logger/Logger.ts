import winston, { createLogger } from "winston";

import { typedObjectKeys } from "@neftie/common";
import { isProd, isStaging } from "utils/constants";

import * as definedTransports from "./transports";

const { exceptionHandler, ...transportsToUse } = definedTransports;

/**
 * Defines severity levels and
 * creates log files based on them
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  db: 3,
  http: 4,
  debug: 5,
};

/**
 * Defines colors used for each
 * level of severity.
 */
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  db: "magenta",
  http: "cyan",
  debug: "blue",
});

/**
 * Collection of transports to be used
 */
const transports: winston.transport[] = [];

typedObjectKeys(transportsToUse).forEach((transport) => {
  transports.push(definedTransports[transport]);
});

/**
 * The main Logger instance, used to log events
 * to the transports specified.
 */
const logger = createLogger({
  level: isProd && !isStaging ? "http" : "debug",
  levels,
  exceptionHandlers: exceptionHandler,
  transports,
  exitOnError: false,
  format: winston.format.combine(winston.format.errors({ stack: true })),
});

export default logger;

/**
 * When calling process.exit(), the process will finish
 * abruptly without waiting for things to cleanup nicely.
 * This means that if we log before exiting, Winston might
 * not be able to finish logging before the process is terminated.
 *
 * This is why before calling process.exit, we'll make sure to wait
 * for all logs to be written to all transports.
 *
 * @see https://github.com/winstonjs/winston/issues/228#issuecomment-511731825
 */

const closeWinstonTransport = (
  transport: typeof transports[number] & { _doneFinish?: boolean }
) => {
  if (!transport.close) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    transport._doneFinish = false;

    function done() {
      if (transport._doneFinish) {
        return;
      }

      transport._doneFinish = true;
      resolve(true);
    }

    setTimeout(() => {
      done();
    }, 5000);

    const finished = () => {
      done();
    };

    transport.once("finish", finished);
    if (transport.close) transport.close();
  });
};

export const waitForWinston = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    for (const transport of transports) {
      try {
        await closeWinstonTransport(transport);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    resolve(true);
  });
};
