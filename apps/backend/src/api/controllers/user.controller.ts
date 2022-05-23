import { Response } from "typera-express";

import type { UserSafe } from "@neftie/common";
import { isValidAddress } from "@neftie/common";
import { userService } from "api/services";
import AppError from "errors/AppError";
import { createController } from "modules/controller";
import { httpResponse } from "utils/http";

/**
 * Get a user by its address or username
 */
export const getUserByUsername = createController(
  "/users/:addressOrUsername",
  "get",
  (route) =>
    route.use().handler(async (ctx) => {
      const { addressOrUsername } = ctx.routeParams;

      let user: UserSafe | null = null;

      if (isValidAddress(addressOrUsername)) {
        // entity is address
        user = await userService.getUser({
          address: addressOrUsername,
        });
      } else {
        // entity might be username
        user = await userService.getUser({
          username: addressOrUsername,
        });
      }

      if (!user) {
        throw new AppError(httpResponse("NOT_FOUND"));
      }

      return Response.ok(user);
    })
);
