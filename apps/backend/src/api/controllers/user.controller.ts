import { UserSafe, isValidAddress } from "@neftie/common";
import { userService } from "api/services";
import AppError from "errors/AppError";
import { createController } from "modules/controller";
import { Response } from "typera-express";
import { httpResponse } from "utils/http";

/**
 * Get a user by its address or username
 */
export const getUserByUsername = createController(
  "/users/:username",
  "get",
  (route) =>
    route.use().handler(async (ctx) => {
      const { username } = ctx.routeParams;

      let user: UserSafe | null = null;

      if (isValidAddress(username)) {
        user = await userService.getUser({
          address: username,
        });
      } else {
        user = await userService.getUser({
          username,
        });
      }

      if (!user) {
        throw new AppError(httpResponse("NOT_FOUND"));
      }

      return Response.ok({ user });
    })
);
