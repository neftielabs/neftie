import type { CookieOptions } from "express";
import jwt from "jsonwebtoken";

import { config } from "config/main";
import type { AccessTokenPayload } from "types/auth";
import { isProd } from "utils/constants";

/**
 * Generates an access token
 */
export const generateAccessToken = (
  payload: Omit<AccessTokenPayload, "version">
) =>
  jwt.sign(
    { ...payload, version: config.tokens.access.currentVersion },
    config.tokens.access.secret,
    {
      expiresIn: config.tokens.access.expires,
    }
  );

/**
 * Verifies the validity of an access token
 */
export const verifyAccessToken = (accessToken: string) => {
  return new Promise<AccessTokenPayload>((resolve, reject) => {
    jwt.verify(accessToken, config.tokens.access.secret, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded as AccessTokenPayload);
    });
  });
};

/**
 * Returns common cookie options for tokens
 */
export const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  path: "/",
  sameSite: "lax",
  domain: `${isProd ? "." : ""}${config.roots.base}`,
  signed: true,
});
