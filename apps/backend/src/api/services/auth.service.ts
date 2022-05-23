import type express from "express";
import { SiweMessage } from "siwe";

import { tokenService } from "api/services";
import { config } from "config/main";
import logger from "modules/Logger/Logger";
import type { Result } from "types/helpers";

/**
 * Verify that the provided message and signature match and are
 * valid
 */
export const verifyWalletSignature = async (data: {
  message: string;
  signature: string;
  expectedNonce: string;
}): Promise<Result<SiweMessage>> => {
  const { message, signature, expectedNonce } = data;

  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);

    if (fields.nonce !== expectedNonce) {
      logger.debug("nonce mismatch");
      return {
        success: false,
      };
    }

    return {
      success: true,
      data: fields,
    };
  } catch (error) {
    logger.warn(error);
    return {
      success: false,
    };
  }
};

/**
 * Sets the cookie for the access token
 */
export const setClientToken = (res: express.Response, token: string) => {
  const cookieOptions = tokenService.getCookieOptions();

  res.cookie(config.tokens.access.key, token, cookieOptions);
};

/**
 * Clears user tokens
 */
export const clearTokens = (res: express.Response) => {
  logger.debug("Clearing tokens");

  res.clearCookie(config.tokens.access.key);
};
