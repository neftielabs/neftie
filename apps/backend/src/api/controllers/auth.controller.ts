import { generateNonce } from "siwe";
import { Response, applyMiddleware } from "typera-express";

import { authSchema } from "@neftie/common";
import { authMiddleware, rateLimitMiddleware } from "api/middleware";
import { withBody } from "api/middleware/validation.middleware";
import { userProvider } from "api/providers";
import {
  authService,
  rateLimitService,
  tokenService,
  userService,
} from "api/services";
import AppError from "errors/AppError";
import RateLimitError from "errors/RateLimitError";
import { createController } from "modules/controller";
import logger from "modules/Logger/Logger";
import { httpResponse } from "utils/http";

const strictLimited = applyMiddleware(
  rateLimitMiddleware.apply(rateLimitService.strictLimiter)
);

/**
 * Sign-in With Ethereum (SIWE)
 *
 * The backend server gives the frontend a random nonce to include
 * in the SIWE message. This nonce is stored in the session and is later
 * compared when verifying the signed message.
 *
 * @see https://github.com/spruceid/siwe
 * @see https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/implement-the-backend
 */
export const getNonce = createController(
  "/auth/nonce",
  "post",
  strictLimited,
  (route) =>
    route.handler((ctx) => {
      const nonce = generateNonce();
      const nonceToken = tokenService.generateAccessToken({ nonce });

      // Set cookie so we can later verify that the provided nonce
      // matches what we generated.

      authService.setClientToken(ctx.res, nonceToken);

      return Response.ok(nonce);
    })
);

/**
 * Sign-in With Ethereum (SIWE)
 *
 * The backend receives a message and a signature, verifies
 * everything is correct and proceeds to sign in the user
 * or sign it up if not found in the database.
 */
export const verifySignature = createController(
  "/auth/connect",
  "post",
  strictLimited,
  (route) =>
    route
      .use(withBody(authSchema.verifyPayload))
      .use(authMiddleware.withAuth("present"))
      .use(rateLimitMiddleware.register)
      .handler(async (ctx) => {
        if (!ctx.auth.nonce) {
          logger.debug("No nonce");
          throw new AppError(httpResponse("BAD_REQUEST"));
        }

        const verifyRes = await authService.verifyWalletSignature({
          message: ctx.body.message,
          signature: ctx.body.signature,
          expectedNonce: ctx.auth.nonce,
        });

        if (!verifyRes.success) {
          logger.debug("Verification fail");
          throw new AppError(httpResponse("BAD_REQUEST"));
        }

        // Lookup user
        let user = await userProvider.getByAddress(verifyRes.data.address);

        if (!user) {
          // Check if it has to be ratelimited
          const rateLimitResult =
            await rateLimitService.registerLimiter.onSuccessfulRegister(
              ctx.req.ip
            );

          if (!rateLimitResult.success) {
            throw new RateLimitError(ctx.res, rateLimitResult.msBeforeNext);
          }

          // Register new user

          user = await userService.registerUser(verifyRes.data.address);
        }

        // Generate token
        const accessToken = tokenService.generateAccessToken({
          userAddress: user.address,
        });

        authService.setClientToken(ctx.res, accessToken);

        return Response.ok({
          token: accessToken,
          user: userService.toSafeUser(user),
        });
      })
);

/**
 * Sign-in With Ethereum (SIWE)
 *
 * The backend receives a valid access token from the client
 * in an httpOnly cookie, verifies its validity and sends the token
 * back to the client in order for it to store it in memory.
 *
 * In short, the client asks the backend
 * "hey, can I also have that token that is probably in cookies?"
 *
 * The client requires it because it is the only way for it to make sure
 * that both the wallet and the backend are authed and in sync.
 */
export const getUserToken = createController(
  "/auth/token",
  "post",
  strictLimited,
  (route) =>
    route.use(authMiddleware.withAuth("present")).handler(async (ctx) => {
      const { token, userAddress } = ctx.auth;

      if (!token || !userAddress) {
        if (token) {
          authService.clearTokens(ctx.res);
        }

        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      const user = await userService.getUser({ address: userAddress });

      if (!user) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      return Response.ok({ token, user });
    })
);

/**
 * Sign-in With Ethereum (SIWE)
 *
 * Since the client has no practical way of accessing or modifying
 * the user cookies, this endpoint will just clear the access token,
 * essentially logging the user out
 */
export const disconnect = createController(
  "/auth/disconnect",
  "post",
  (route) =>
    route.use(authMiddleware.withAuth("required")).handler((ctx) => {
      authService.clearTokens(ctx.res);
      return Response.noContent();
    })
);
