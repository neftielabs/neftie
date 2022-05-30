import { Response, applyMiddleware } from "typera-express";

import { meSchema } from "@neftie/common";
import { authMiddleware, fileMiddleware } from "api/middleware";
import { withQuery } from "api/middleware/validation.middleware";
import { userService } from "api/services";
import AppError from "errors/AppError";
import { createReusableController } from "modules/controller";
import { isValidSingleFile } from "utils/file";
import { httpResponse } from "utils/http";

const authController = createReusableController(
  applyMiddleware(authMiddleware.withAuth("required"))
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
        !isValidSingleFile(file, 15 * 1024 * 1024) ||
        !["avatar", "banner"].includes(entity)
      ) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      const uploadResult = await userService.handleProfileUpload({
        userId: ctx.auth.userId,
        file,
        entity,
      });

      if (!uploadResult) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      return Response.created();
    })
);
