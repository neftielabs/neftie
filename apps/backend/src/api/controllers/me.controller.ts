import { meSchema } from "@neftie/common";
import { authMiddleware, fileMiddleware } from "api/middleware";
import { withQuery } from "api/middleware/validation.middleware";
import { userService } from "api/services";
import AppError from "errors/AppError";
import { createReusableController } from "modules/controller";
import { Response, applyMiddleware } from "typera-express";
import { httpResponse } from "utils/http";

const authController = createReusableController(
  applyMiddleware(authMiddleware.withAuth("required"))
);

/**
 * Return the current authorized user.
 * Fails if the token is invalid and returns `user: null` if the
 * user isn't found
 */
export const getMe = authController("/me", "get", (route) =>
  route.handler(async (ctx) => {
    const user = await userService.getUser({ userId: ctx.auth.userId });
    return Response.ok({ user });
  })
);

/**
 * Upload user-related files
 */
export const uploadFile = authController("/me/upload", "post", (route) =>
  route
    .use(fileMiddleware.generic())
    .use(withQuery(meSchema.fileUpload))
    .handler(async (ctx) => {
      const entity = ctx.query.entity as "banner" | "avatar";
      const file = ctx.req.files?.file;

      if (
        !file ||
        Array.isArray(file) ||
        file.size > 15 * 1024 * 1024 ||
        file.truncated ||
        !["avatar", "banner"].includes(entity)
      ) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      const uploadResult = await userService.handleAssetUpload(
        ctx.auth.userId,
        file,
        entity
      );

      if (!uploadResult) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      return Response.created();
    })
);
