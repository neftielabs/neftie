import GlobalLimiter from "modules/rate-limiters/GlobalLimiter";
import RegisterLimiter from "modules/rate-limiters/RegisterLimiter";
import StrictLimiter from "modules/rate-limiters/StrictLimiter";

/**
 * Global rate limiter.
 * Allows 10 requests per 1 second per IP Address
 */
export const globalLimiter = new GlobalLimiter();

/**
 * Register rate limiter.
 * Allows 2 successful signups per hour per IP Address
 */
export const registerLimiter = new RegisterLimiter();

/**
 * Strict rate limiter.
 * Allows 2 requests per 1 second per IP Address.
 */
export const strictLimiter = new StrictLimiter();
