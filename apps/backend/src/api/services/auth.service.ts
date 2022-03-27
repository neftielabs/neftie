import { tokenService } from "api/services";
import { config } from "config/main";
import express from "express";
import { SiweMessage } from "siwe";
import { Result } from "types/helpers";

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

  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);

  if (fields.nonce !== expectedNonce) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: fields,
  };
};

/**
 * Sets the cookie for the access token
 */
export const setClientToken = (res: express.Response, token: string) => {
  const cookieOptions = tokenService.getCookieOptions();

  res.cookie(config.tokens.access.key, token, cookieOptions);
};
