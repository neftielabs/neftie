import RateLimiter from "modules/rate-limiters/RateLimiter";

export default class GlobalLimiter extends RateLimiter {
  constructor() {
    super({
      points: 10,
      duration: 1,
      keyPrefix: "limiter_global",
      execEvenly: true,
      config: {},
      limiterName: "global",
    });
  }
}
