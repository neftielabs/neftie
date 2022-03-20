import { Response } from "typera-express";
/**
 * Collection of all the routes, their available
 * methods and the expected response type.
 */
export type RouteManifest = {
  /**
   * Healthchecking
   */
  "/health": {
    get: {
      response: [Response.Ok<string>];
    };
  };
};
