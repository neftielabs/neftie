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
   */
  constructor(message: [string, number]);
  constructor(message: string, statusCode: number);
  constructor(
    message: string | [string, number],
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
  ) {
    let httpMessage = "";
    let httpCode = statusCode;

    if (Array.isArray(message)) {
      httpMessage = message[0];
      httpCode = message[1];
    } else {
      httpMessage = message;
    }

    super(httpMessage);
    Object.setPrototypeOf(this, AppError.prototype);

    this.statusCode = httpCode;
    this.status = String(httpCode).startsWith("4") ? "fail" : "error";

    // Flag to determine if it is a trusted error (ie. thrown manually)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
