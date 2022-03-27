import { AccessTokenPayload } from "types/auth";
import { config } from "config/main";
import { CookieOptions } from "express";
import { isProd } from "utils/constants";
import jwt from "jsonwebtoken";

/**
 * Generates an access token
 */
export const generateAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, config.tokens.access.secret, {
    expiresIn: config.tokens.access.expires,
  });

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
