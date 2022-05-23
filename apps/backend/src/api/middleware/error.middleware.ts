import { captureException } from "@sentry/node";
import type express from "express";
import httpStatus from "http-status";

import AppError from "errors/AppError";
import logger from "modules/Logger/Logger";
import { isProd } from "utils/constants";
import { convertToSafeError, exitProcess } from "utils/errror";
import { httpResponse } from "utils/http";

/**
 * Catch 404 errors and forward them to the handler
 */
export const notFound: express.Handler = ({ originalUrl }, res, next) => {
  logger.warn(`Route not found - ${originalUrl}`);
  return next(new AppError(httpResponse("NOT_FOUND")));
};

/**
 * The 'unhandledRejection' event is emitted whenever a Promise is rejected
 * and no error handler is attached to the promise.
 *
 * The 'unhandledRejection' event is useful for detecting and keeping track
 * of promises that were rejected and whose rejections have not yet been handled.
 *
 * @see https://nodejs.org/api/process.html#process_event_unhandledrejection
 */
export const unhandledRejection = (
  reason: Error,
  promise: Promise<unknown>
) => {
  logger.warn("Unhandled Rejection at Promise", { reason, promise });
  captureException(reason);
};

/**
 * The 'uncaughtException' event is emitted when an uncaught JavaScript
 * exception bubbles all the way back to the event loop omitting Express.js
 * error handlers.
 * Ideally, this should not be happening as all errors should be correctly
 * handled by Express.
 * @see http://expressjs.com/en/guide/error-handling.html
 *
 * The default way of how Node.js handles such exceptions is preserved:
 * 1. the stack trace is printed to stderr
 * 2. app exits with code 1
 * @see https://nodejs.org/api/process.html#process_event_uncaughtexception
 *
 * ⚠ Warning
 * It is not safe to resume normal operation after an 'uncaughtException'
 * @see https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
 */
export const uncaughtException = (err: Error) => {
  captureException(err);
  logger.error(err);
  exitProcess();
};

export interface ExtendableError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

/**
 * Handles errors on development environments. Basically returns the raw
 * error with the stack included.
 */
const handleErrorDev = (
  err: AppError | ExtendableError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Handles errors on production environments. As the error will have been
 * converted to an instance of AppError, status and message should be safe
 * to be sent to the client
 */
const handleErrorProd = (
  err: AppError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    status: err.status,
    message: err.message,
  });
};

/**
 * Final error middleware.
 *
 * Checks environment and delegates error to different handlers. During development,
 * it will be sent raw and during production it will convert it to an instance
 * of AppError and send the message and status.
 */
export const finalErrorHandler = (
  err: AppError | ExtendableError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Error during development

  if (!isProd) {
    logger.warn(err);
    return handleErrorDev(err, req, res, next);
  }

  const codesToSkip = [400, 401, 404, 422];

  if (!err.statusCode || !codesToSkip.includes(err.statusCode)) {
    captureException(err);
  }

  // Error during production that wasn't thrown manually

  if (!err.isOperational) {
    err.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    err.status = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] as string;
  }

  /**
   * Delegate to the default Express error handler,
   * when the headers have already been sent to the client
   */
  if (res.headersSent) {
    return next(err);
  }

  /**
   * Log unknown errors
   */
  if (!err.isOperational) logger.warn(err);

  // Convert error to instance of AppError

  const error = convertToSafeError(err);

  // Return error to client

  return handleErrorProd(error, req, res, next);
};
