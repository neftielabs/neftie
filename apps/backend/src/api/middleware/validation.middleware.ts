/* eslint-disable no-console */
/* eslint-disable require-await */

/**
 * Validation for the request body, query and cookies,
 * based on a provided yup schema that outlines the specs
 * of how the data should be provided to the API.
 * The frontend already enforces these same schemas, but another
 * layer of control is essential.
 *
 * @see https://github.com/jquense/yup
 */

import httpStatus from "http-status";
import { Middleware } from "typera-express";
import type { AnyObjectSchema, Asserts } from "yup";
import type { ValidateOptions } from "yup/lib/types";

import AppError from "errors/AppError";

const defaultValidationOptions: ValidateOptions = {
  stripUnknown: true,
};

type ValidationMiddleware<T extends string> = <Schema extends AnyObjectSchema>(
  schema: Schema,
  validateOptions?: ValidateOptions
) => Middleware.Middleware<{ [K in T]: Asserts<Schema> }, never>;

/**
 * Validates the request body based on
 * a provided schema.
 */
export const withBody: ValidationMiddleware<"body"> =
  (schema, validateOptions) => async (ctx) => {
    return schema
      .validate(ctx.req.body, {
        ...defaultValidationOptions,
        ...validateOptions,
      })
      .then((valid) => Middleware.next({ body: valid }))
      .catch((err) => {
        console.log(err);
        const errorMessage = err.errors.join(", ");
        throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
      });
  };

/**
 * Validates the parsed query params.
 */
export const withQuery: ValidationMiddleware<"query"> =
  (schema, validateOptions) => async (ctx) => {
    return schema
      .validate(ctx.req.query, {
        ...defaultValidationOptions,
        ...validateOptions,
      })
      .then((valid) => Middleware.next({ query: valid }))
      .catch((err) => {
        console.log(err);
        const errorMessage = err.errors.join(", ");
        throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
      });
  };

/**
 * Validates provided cookies
 */
export const withCookies: ValidationMiddleware<"cookies"> =
  (schema, validateOptions) => async (ctx) => {
    return schema
      .validate(ctx.req.cookies, {
        ...defaultValidationOptions,
        ...validateOptions,
      })
      .then((valid) => Middleware.next({ cookies: valid }))
      .catch((err) => {
        console.log(err);
        const errorMessage = err.errors.join(", ");
        throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
      });
  };
