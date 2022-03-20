import httpStatus from "http-status";
import express from "express";
import AppError from "errors/AppError";

/**
 * Custom error for rate limited requests
 * that sets the retry-after header
 */
export default class RateLimitError extends AppError {
  constructor(res: express.Response, retryAfter?: number) {
    super("rateLimit", httpStatus.TOO_MANY_REQUESTS);

    let waitTime = retryAfter || 1000;

    if (retryAfter) {
      waitTime = Math.round(retryAfter / 1000) || 1;
    }

    res.set("Retry-After", String(waitTime));
  }
}
