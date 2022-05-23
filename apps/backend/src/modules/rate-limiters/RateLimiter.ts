import type express from "express";
import type { IRateLimiterOptions } from "rate-limiter-flexible";
import { RateLimiterMemory } from "rate-limiter-flexible";

import logger from "modules/Logger/Logger";

export default class RateLimiter<
  T = Record<string, never>
> extends RateLimiterMemory {
  public readonly config: T;
  public readonly limiterName: string;

  constructor(
    opts: IRateLimiterOptions & { config: T } & { limiterName: string }
  ) {
    const { config, limiterName, ...limiterOptions } = opts;

    super(limiterOptions);

    this.config = config;
    this.limiterName = limiterName;
  }

  public logLimited(req: express.Request) {
    logger.info(
      `[RateLimiter - ${this.limiterName}] Limited ip ${req.ip} on '${req.url}'`
    );
  }
}
