import { Response } from "typera-express";
import { UserSafe } from "../models/user";
/**
 * Collection of all the routes, their available
 * methods and the expected response type.
 */
export type RouteManifest = {
  /**
   * Healthchecks
   */
  "/health": {
    get: {
      response: [Response.Ok<string>];
    };
  };

  /**
   * Auth
   */
  "/auth/nonce": {
    get: {
      response: [Response.Ok<string>];
    };
  };
  "/auth/verify": {
    post: {
      response: [Response.Ok<{ user: UserSafe }>];
    };
  };

  /**
   * User
   */
  "/me": {
    get: {
      response: [Response.Ok<{ user: UserSafe | null }>];
    };
  };
};
