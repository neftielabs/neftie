import { Response } from "typera-express";

import { isValidAddress } from "@neftie/common";
import type { User } from "@neftie/prisma";
import { userProvider } from "api/providers";
import { userService } from "api/services";
import AppError from "errors/AppError";
import { createController } from "modules/controller";
import { httpResponse } from "utils/http";

/**
 * Get a user by its address or username
 */
export const getUserByUsername = createController(
  "/users/:userIdOrUsername",
  "get",
  (route) =>
    route.use().handler(async (ctx) => {
      const { userIdOrUsername } = ctx.routeParams;

      let user: User | null = null;

      if (isValidAddress(userIdOrUsername)) {
        // entity is address
        user = await userProvider.getById(userIdOrUsername);
      } else {
        // entity might be username
        user = await userProvider.getByUsername(userIdOrUsername);
      }

      if (!user) {
        throw new AppError(httpResponse("NOT_FOUND"));
      }

      const { twitterHandle, websiteUrl, bio, location } = user;

      return Response.ok({
        ...userService.toSafeUser(user),
        twitterHandle,
        websiteUrl,
        bio,
        location,
      });
    })
);

/**
 * Checks if a username already exists
 */
export const checkUsernameAvailability = createController(
  "/users/:username/available",
  "get",
  (route) =>
    route.handler(async (ctx) => {
      const user = await userProvider.getByUsername(ctx.routeParams.username);
      return Response.ok({ available: !user });
    })
);

/**
 * Returns stats for a given user
 */
export const getUserStats = createController(
  "/users/:userId/stats",
  "get",
  (route) =>
    route.handler(() => {
      return Response.ok();
    })
);
