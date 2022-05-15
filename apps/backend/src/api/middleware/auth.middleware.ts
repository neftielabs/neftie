import { Middleware } from "typera-express";
import express from "express";
import { config } from "config/main";
import logger from "modules/Logger/Logger";
import AppError from "errors/AppError";
import { httpResponse } from "utils/http";
import { tokenService } from "api/services";

/**
 * Extracts the access token from the cookies
 */
const extractTokenFromCookies = (req: express.Request) => {
  const cookies = req.signedCookies;

  if (cookies && Object.keys(cookies).length) {
    const accessToken = (cookies[config.tokens.access.key] || undefined) as
      | string
      | undefined;

    if (accessToken) {
      return accessToken;
    }
  }
};

type AuthMode = "required" | "optional" | "present";
type AuthRequired = { auth: { token: string; userId: string; nonce?: string } };
type AuthOptional = {
  auth: { token?: string; userId?: string; nonce?: string };
};

type WithAuth<T extends AuthMode> = T extends "optional" | "present"
  ? Middleware.Middleware<AuthOptional, never>
  : Middleware.Middleware<AuthRequired, never>;

/**
 * Middleware to handle auth.
 *
 * Modes:
 *  - Required: Token has to be present and valid
 *  - Present: Token is not required, but if it exists it should be valid
 *  - Optional: Token not required and can be invalid (will be ignored)
 */
export function withAuth<T extends AuthMode>(mode: T): WithAuth<T>;
export function withAuth<T extends AuthMode>(
  mode: T
): Middleware.Middleware<AuthRequired | AuthOptional, never> {
  return async (ctx) => {
    const accessToken = extractTokenFromCookies(ctx.req);

    /**
     * If auth mode is "required" and token isn't there,
     * deny access to resources
     */

    if (!accessToken && mode === "required") {
      logger.debug("[AuthMiddleware] Token not found");
      throw new AppError(httpResponse("BAD_REQUEST"));
    } else if (!accessToken) {
      /**
       * If auth mode is not "required" and token isn't there,
       * early return
       */

      return Middleware.next({ auth: {} });
    }

    /**
     * Token exists from this point onwards, perform
     * validation and enforce rules based on auth mode
     */

    try {
      const { userId, nonce } = await tokenService.verifyAccessToken(
        accessToken
      );

      /**
       * If user id is not in the decoded payload and
       * auth mode is "required", deny access
       */

      if (!userId && mode === "required") {
        logger.debug("[AuthMiddleware] No userId in token payload");
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      /**
       * All checks have passed and we can safely return
       * the decoded payload
       */

      return Middleware.next({
        auth: {
          userId,
          nonce,
          token: accessToken,
        },
      });
    } catch (error) {
      logger.debug("[AuthMiddleware] Error verifying access token");
      logger.debug(error);

      /**
       * If an error occurred while decoding the token
       * and mode is either "required" or "present",
       * deny access
       */

      if (["required", "present"].includes(mode)) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      /**
       * Mode is "optional", which doesn't require a valid
       * access token
       */

      return Middleware.next({ auth: {} });
    }
  };
}
