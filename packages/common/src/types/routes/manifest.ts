import { Listing } from "@neftie/prisma";
import { Response } from "typera-express";
import { ListingMinimal } from "../models";
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
  "/me": {
    get: {
      response: [Response.Ok<{ user: UserSafe | null }>];
    };
  };
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
      response: [Response.Ok<{ user: UserSafe }>];
    };
  };

  /**
   * Listings
   */
  "/listings": {
    post: {
      response: [
        Response.Created<{ listing: Listing }>,
        Response.Ok<{ listing: Listing | null }>
      ];
    };
  };
  "/listings/:address/verify": {
    get: {
      response: [Response.Ok<ListingMinimal>, Response.NotFound];
    };
  };
  "/listings/user/:address": {
    get: {
      response: [Response.Ok];
    };
  };
};
