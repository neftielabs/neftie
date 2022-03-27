import RateLimiter from "modules/rate-limiters/RateLimiter";

export default class StrictLimiter extends RateLimiter {
  constructor() {
    super({
      keyPrefix: "limiter_strict",
      points: 2,
      duration: 1,
      config: {},
      limiterName: "strict",
    });
  }
}
