import Log from "modules/Log";
import RateLimiter from "modules/rate-limiters/RateLimiter";

export default class RegisterLimiter extends RateLimiter<{
  maxRegisters: number;
}> {
  private log = new Log();

  constructor() {
    super({
      keyPrefix: "limiter_register_ip",
      points: 2, // Allow 2 successful signups/hour per ip
      duration: 60 * 60 * 24 * 90, // Store for 90 days since first fail
      blockDuration: 60 * 60, // Block for 1 hour
      config: { maxRegisters: 2 },
      limiterName: "register",
    });
  }

  /**
   * Will consume points from this limiter (when called)
   * on successful signup. If the points were to be consumed,
   * the middleware will catch it if another signup is attempted.
   */
  async onSuccessfulRegister(ipAddress: string) {
    this.log.setTargets("RegisterLimiter", "onSuccessfulRegister");

    try {
      await this.consume(ipAddress);
      return {
        success: true,
      };
    } catch (error: any) {
      if (error instanceof Error) {
        this.log.all(error);
      }

      return {
        success: false,
        msBeforeNext: error.msBeforeNext,
      };
    }
  }
}
