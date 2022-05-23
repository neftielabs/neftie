import type { Response } from "typera-express";

import type { ListingFull, ListingPreview } from "../models";
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

  "/users/:addressOrUsername": {
    get: {
      response: [Response.Ok<UserSafe>];
    };
  };

  /**
   * Listings
   */

  "/listings/:address": {
    get: {
      response: [
        Response.Ok<ListingFull>,
        Response.NotFound,
        Response.UnprocessableEntity
      ];
    };
    patch: {
      response: [Response.Ok, Response.UnprocessableEntity];
    };
  };

  "/listings/:address/verify": {
    get: {
      response: [
        Response.Ok<ListingPreview>,
        Response.NotFound,
        Response.UnprocessableEntity
      ];
    };
  };

  "/listings/user/:address": {
    get: {
      response: [Response.Ok<Paginated<ListingPreview[]>>];
    };
  };

  /**
   * Orders
   */

  "/orders/listing/:address/verify": {
    get: {
      response: [Response.Ok, Response.NotFound];
    };
  };

  "/orders/user/:address": {
    get: {
      response: [Response.Ok<Paginated<never[]>>];
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
