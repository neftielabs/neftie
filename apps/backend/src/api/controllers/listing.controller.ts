import { Response, applyMiddleware } from "typera-express";

import { isValidAddress, listingSchema } from "@neftie/common";
import {
  authMiddleware,
  fileMiddleware,
  filterMiddleware,
  rateLimitMiddleware,
} from "api/middleware";
import { withBody } from "api/middleware/validation.middleware";
import { listingService } from "api/services";
import { strictLimiter } from "api/services/rate-limit.service";
import { createController, createReusableController } from "modules/controller";
import logger from "modules/Logger/Logger";
import { isValidSingleFile } from "utils/file";
import { isErrorResult, withPagination } from "utils/helpers";

const authController = createReusableController(
  applyMiddleware(authMiddleware.withAuth("required"))
);

/**
 * Returns a listing by its id
 */
export const getListing = createController(
  "/listings/:listingId",
  "get",
  (route) =>
    route.handler(async (ctx) => {
      const listingId = ctx.routeParams.listingId;

      if (!isValidAddress(listingId)) {
        return Response.unprocessableEntity();
      }

      const listing = await listingService.getListing(listingId);

      if (!listing) {
        return Response.notFound();
      }

      return Response.ok(listing);
    })
);

/**
 * Allows updating off-chain data of a given listing
 */
export const patchListing = authController(
  "/listings/:listingId",
  "patch",
  (route) =>
    route
      .use(withBody(listingSchema.serverEditListing))
      .use(fileMiddleware.generic())
      .use(rateLimitMiddleware.apply(strictLimiter))
      .handler(async (ctx) => {
        const { userId } = ctx.auth;
        const { description } = ctx.body;
        const file = ctx.req.files?.coverFile;

        if (file && !isValidSingleFile(file, 10 * 1024 * 1024)) {
          logger.debug("Invalid file");
          return Response.unprocessableEntity();
        }

        try {
          // Double parsing JSON is necessary
          const parsedDescription = description
            ? JSON.parse(JSON.parse(description))
            : null;

          const patchResult = await listingService.updateOffChainData({
            listingId: ctx.routeParams.listingId,
            sellerId: userId,
            description: parsedDescription,
            file,
          });

          if (isErrorResult(patchResult, "unprocessable")) {
            logger.debug("unprocessable");
            return Response.unprocessableEntity();
          }

          return Response.ok();
        } catch {
          logger.debug("bad description");
          return Response.unprocessableEntity();
        }
      })
);

/**
 * Verifies that a listing is created and exists in the blockchain
 * by checking if it has been indexed by the subgraph
 */
export const verifyListingCreated = authController(
  "/listings/:listingId/verify",
  "get",
  (route) =>
    route.handler(async (ctx) => {
      const listingId = ctx.routeParams.listingId;

      if (!isValidAddress(listingId)) {
        return Response.unprocessableEntity();
      }

      const listing = await listingService.ensureListingExists(listingId);

      if (!listing) {
        return Response.notFound();
      }

      return Response.ok(listing);
    })
);

/**
 * Returns the listings published by a given
 * seller
 */
export const getUserListings = createController(
  "/users/:userId/listings",
  "get",
  (route) =>
    route.use(filterMiddleware.pagination).handler(async (ctx) => {
      const listings = await listingService.getSellerListings({
        sellerId: ctx.routeParams.userId,
        pagination: ctx.filters.pagination,
      });

      return Response.ok(
        withPagination(listings, {
          cursor: "id",
          limit: ctx.filters.pagination.limit,
        })
      );
    })
);
