import httpStatus from "http-status";

/**
 * Class representing App errors
 */
export default class AppError extends Error {
  statusCode;
  status;
  isOperational;

  /**
   * Creates an App error.
   *
   * @param message - Error message
   * @param statusCode - HTTP status code of error
   */
  constructor(
    message: string,
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";

    // Flag to determine if it is a trusted error (ie. thrown manually)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
