import type express from "express";
import { Middleware } from "typera-express";

import { rateLimitService } from "api/services";
import { registerLimiter } from "api/services/rate-limit.service";
import RateLimitError from "errors/RateLimitError";
import Log from "modules/Log";
import type RateLimiter from "modules/rate-limiters/RateLimiter";

const { globalLimiter } = rateLimitService;

/**
 * Global rate limiter.
 * Applied app-wide as an express global middleware.
 */
export const global = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return globalLimiter
    .consume(req.ip)
    .then(() => next())
    .catch((err) => {
      if (err instanceof Error) {
        // Unknown error
        const log = new Log();
        log.setTargets("rateLimitMiddleware", "global");
        log.all(err);
        throw err;
      }

      globalLimiter.logLimited(req);
      throw new RateLimitError(res, err.msBeforeNext);
    });
};

/**
 * Register rate limiter.
 * Limits the number of registers per ip
 */
export const register: Middleware.Middleware<unknown, never> = async (ctx) => {
  const ipAddress = ctx.req.ip;
  const key = await registerLimiter.get(ipAddress);

  let msBeforeNext = 0;

  if (
    key !== null &&
    key.consumedPoints > registerLimiter.config.maxRegisters
  ) {
    msBeforeNext = key.msBeforeNext;
  }

  if (msBeforeNext > 0) {
    // Block current request
    registerLimiter.logLimited(ctx.req);
    throw new RateLimitError(ctx.res, msBeforeNext);
  }

  // Request can continue and the endpoint will take care
  // of consuming points on successful signup

  return Middleware.next();
};

/**
 * Placeholder middleware that applies any given
 * rate limiter without any extra processing.
 *
 * @param keyResolver - A callback function that receives the Express request obejct
 * and must return a string to be used as the rate limiter key. Default key is the IP Address.
 */
export const apply =
  (
    rt: RateLimiter,
    keyResolver?: (req: express.Request) => string
  ): Middleware.Middleware<unknown, never> =>
  (ctx) =>
    rt
      .consume(keyResolver ? keyResolver(ctx.req) : ctx.req.ip)
      .then(() => Middleware.next())
      .catch((err) => {
        if (err instanceof Error) {
          const log = new Log();
          log.setTargets("rateLimitMiddleware", `apply@${rt.limiterName}`);
          log.all(err);
          throw err;
        }

        rt.logLimited(ctx.req);
        throw new RateLimitError(ctx.res, err.msBeforeNext);
      });
