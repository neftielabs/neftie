import { createController } from "modules/controller";
import { Response } from "typera-express";

/**
 * Endpoint to check if the app is responsive
 * and ready to accept requests.
 */
export const healthCheck = createController("/health", "get", (route) =>
  route.handler(() => {
    return Response.ok("ok");
  })
);
