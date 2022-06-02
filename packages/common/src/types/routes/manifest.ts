import type { Response } from "typera-express";

import type {
  IListingFull,
  IListingPreview,
  IOrderFull,
  IOrderPreview,
} from "../models";
import type { UserSafe } from "../models/user";
import type { Paginated } from "../utils";

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
    post: {
      response: [Response.Ok<string>];
    };
  };

  "/auth/connect": {
    post: {
      response: [Response.Ok<{ token: string; user: UserSafe }>];
    };
  };

  "/auth/token": {
    post: {
      response: [Response.Ok<{ token: string; user: UserSafe }>];
    };
  };

  "/auth/disconnect": {
    post: {
      response: [Response.NoContent];
    };
  };

  /**
   * Authorized user
   */

  "/me/upload": {
    post: {
      response: [Response.Created];
    };
  };

  /**
   * Users
   */

  "/users/:userIdOrUsername": {
    get: {
      response: [Response.Ok<UserSafe>];
    };
  };

  /**
   * Listings
   */

  "/listings/:listingId": {
    get: {
      response: [
        Response.Ok<IListingFull>,
        Response.NotFound,
        Response.UnprocessableEntity
      ];
    };
    patch: {
      response: [Response.Ok, Response.UnprocessableEntity];
    };
  };

  "/listings/:listingId/verify": {
    get: {
      response: [
        Response.Ok<IListingPreview>,
        Response.NotFound,
        Response.UnprocessableEntity
      ];
    };
  };

  "/users/:userId/listings": {
    get: {
      response: [Response.Ok<Paginated<IListingPreview[]>>];
    };
  };

  /**
   * Orders
   */

  "/listings/:listingId/orders/verify": {
    get: {
      response: [Response.Ok<IOrderPreview>, Response.NotFound];
    };
  };

  "/me/orders": {
    get: {
      response: [Response.Ok<Paginated<IOrderPreview[]>>];
    };
  };

  "/me/orders/:composedOrderId": {
    get: {
      response: [Response.Ok<IOrderFull>, Response.NotFound];
    };
  };

  /**
   * Tools
   */

  "/tools/eth": {
    get: {
      response: [
        Response.Ok<{
          ethUsdPrice: number;
        }>
      ];
    };
  };
};
