import { Middleware } from "typera-express";
import express from "express";
import { config } from "config/main";
import Logger from "modules/Logger/Logger";
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
type AuthRequired = { auth: { userId: string; nonce?: string } };
type AuthOptional = { auth: { userId?: string; nonce?: string } };

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
    let result: AuthRequired | AuthOptional = {
      auth: {},
    };

    if (!accessToken && mode === "required") {
      Logger.debug("[Auth] Token not found and was required");
      throw new AppError(httpResponse("UNAUTHORIZED"));
    } else if (accessToken) {
      try {
        const tokenPayload = await tokenService.verifyAccessToken(accessToken);

        if (tokenPayload.userId && mode === "required") {
          result = {
            auth: {
              userId: tokenPayload.userId,
              nonce: tokenPayload.nonce,
            },
          };
        } else if (!tokenPayload.userId && mode === "required") {
          throw new AppError(httpResponse("UNAUTHORIZED"));
        }

        result = {
          auth: tokenPayload,
        };
      } catch (error) {
        Logger.debug(`[Auth] Error verifying access token`);
        Logger.debug(error);

        if (mode === "required" || mode === "present") {
          Logger.debug(`[Auth] Token verify error and mode ${mode}`);
          throw new AppError(httpResponse("UNAUTHORIZED"));
        }

        result = { auth: {} };
      }
    }

    return Middleware.next(result);
  };
}
