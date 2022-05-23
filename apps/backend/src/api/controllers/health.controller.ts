import { Response } from "typera-express";

import { createController } from "modules/controller";

/**
 * Endpoint to check if the app is responsive
 * and ready to accept requests.
 */
export const healthCheck = createController("/health", "get", (route) =>
  route.handler(() => {
    return Response.ok("ok");
  })
);
