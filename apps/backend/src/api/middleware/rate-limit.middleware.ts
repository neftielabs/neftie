import { rateLimitService } from "api/services";
import RateLimitError from "errors/RateLimitError";
import express from "express";
import Log from "modules/Log";

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
  globalLimiter
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
