import { captureException } from "@sentry/node";
import { CaptureContext } from "@sentry/node/node_modules/@sentry/types";
import Logger from "modules/Logger/Logger";

/**
 * Utility class to log to multiple transports
 * like Winston and Sentry at the same time,
 * avoiding repetition and code bloating.
 */
export default class Log {
  private section = "";
  private function?: string;

  /**
   * Set the current section and function in code.
   * Useful to better target errors where stacks might not
   * correctly locate the origin of the issue.
   * Also used as tags for Sentry.
   */
  public setTargets(section: string, func?: string) {
    this.section = section;
    this.function = func;
  }

  /**
   * Setter for the section only
   */
  public setTargetSection(v: string) {
    this.section = v;
  }

  /**
   * Setter for the function only
   */
  public setTargetFunction(v: string) {
    this.function = v;
  }

  /**
   * Log an error to the Winston transport.
   *
   * Note: this uses the `warn` level.
   */
  public winston(error: any, meta?: Record<string, unknown>) {
    const data = {
      section: this.section,
      function: this.function
        ? `${this.section} > ${this.function}`
        : undefined,
      ...meta,
    };

    if (error instanceof Error) {
      Logger.warn(error.message, {
        error,
        ...data,
      });
    } else {
      Logger.warn(error, { data });
    }
  }

  /**
   * Format Sentry context
   */
  private getSentryMeta(
    section: string,
    func?: string,
    extra?: Record<string, unknown>
  ): CaptureContext {
    return {
      tags: {
        section,
        function: func,
      },
      extra,
    };
  }

  /**
   * Log an error to Sentry.
   */
  public sentry(
    error: any,
    meta?: Record<string, unknown>,
    stringify?: boolean
  ) {
    let formattedError = error;
    if (
      !(formattedError instanceof Error) &&
      typeof formattedError === "string"
    ) {
      formattedError = new Error(formattedError);
    }

    captureException(
      formattedError,
      this.getSentryMeta(
        this.section,
        this.function ? `${this.section} > ${this.function}` : undefined,
        stringify ? { data: JSON.stringify(meta, null, 2) } : meta
      )
    );
  }

  /**
   * Log an error to both Winston and Sentry.
   * Analogous of calling `log.w` and `log.s` consecutively
   * with the same data.
   */
  public all(
    error: any,
    meta?: Record<string, unknown>,
    opts?: { stringify?: boolean }
  ) {
    this.winston(error, meta);
    this.sentry(error, meta, opts?.stringify);
  }
}

type CallbackFunc = (log: Log, ...args: any[]) => any;
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

/**
 * Utility wrapper for functions that initializes
 * the Log class and passes it as the first argument.
 *
 * Equivalent to doing new Log(); log.set(...);, but easier.
 */
export const withLog =
  <C extends CallbackFunc, O extends OmitFirstArg<C>>(cb: C) =>
  (...originalArgs: Parameters<O>): ReturnType<O> => {
    const log = new Log();
    return cb(log, ...originalArgs);
  };
