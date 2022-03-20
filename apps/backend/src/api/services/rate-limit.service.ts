import GlobalLimiter from "modules/rate-limiters/GlobalLimiter";

/**
 * Global rate limiter.
 * Allows 10 requests per 1 second per IP Address
 */
export const globalLimiter = new GlobalLimiter();
