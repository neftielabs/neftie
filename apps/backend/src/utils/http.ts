import httpStatus from "http-status";

import type { HttpStatus } from "types/httpStatus";

type HttpResponse = (key: keyof HttpStatus) => [string, number];

/**
 * Utility to pass a generic status and message
 * to our AppError class.
 *
 * httpResponse("NOT_FOUND") = ["Not found", 404]
 */
export const httpResponse: HttpResponse = (key) => [
  httpStatus[httpStatus[key] as string] as string,
  httpStatus[key] as number,
];
