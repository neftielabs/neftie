import { Response } from "typera-express";
import { ListingFull, ListingPreview } from "../models";
import { UserSafe } from "../models/user";
import { Paginated } from "../utils";

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
  "/listings/:address": {
    get: {
      response: [
        Response.Ok<ListingFull>,
        Response.NotFound,
        Response.UnprocessableEntity
      ];
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
