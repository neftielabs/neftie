import { authSchema } from "@neftie/common";
import { rateLimitMiddleware } from "api/middleware";
import { withAuth } from "api/middleware/auth.middleware";
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
import { generateNonce } from "siwe";
import { Response, applyMiddleware } from "typera-express";
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
  "get",
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
 * Verify the signed message and proceed to
 * sign in or sign up the user.
 */
export const verifySignature = createController(
  "/auth/verify",
  "post",
  strictLimited,
  (route) =>
    route
      .use(withBody(authSchema.verifyPayload))
      .use(withAuth("present"))
      .use(rateLimitMiddleware.register)
      .handler(async (ctx) => {
        if (!ctx.auth.nonce) {
          throw new AppError(httpResponse("BAD_REQUEST"));
        }

        const verifyRes = await authService.verifyWalletSignature({
          message: ctx.body.message,
          signature: ctx.body.signature,
          expectedNonce: ctx.auth.nonce,
        });

        if (!verifyRes.success) {
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
          userId: user.id,
        });

        authService.setClientToken(ctx.res, accessToken);

        return Response.ok({ user: userService.toSafeUser(user) });
      })
);
