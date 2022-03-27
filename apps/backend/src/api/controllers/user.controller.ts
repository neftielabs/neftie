import { authMiddleware } from "api/middleware";
import { userService } from "api/services";
import { createController } from "modules/controller";
import { Response } from "typera-express";

export const getMe = createController("/me", "get", (route) =>
  route.use(authMiddleware.withAuth("required")).handler(async (ctx) => {
    const user = await userService.getSafeUser({ userId: ctx.auth.userId });
    return Response.ok({ user });
  })
);
