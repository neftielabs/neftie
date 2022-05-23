import { Response, applyMiddleware } from "typera-express";

import { isValidAddress, listingSchema } from "@neftie/common";
import {
  authMiddleware,
  fileMiddleware,
  filterMiddleware,
} from "api/middleware";
import { withBody } from "api/middleware/validation.middleware";
import { listingService } from "api/services";
import { createController, createReusableController } from "modules/controller";
import { isValidSingleFile } from "utils/file";
import { isErrorResult, withPagination } from "utils/helpers";

const authController = createReusableController(
  applyMiddleware(authMiddleware.withAuth("required"))
);

/**
 * Returns a listing by its id
 */
export const getListing = createController(
  "/listings/:address",
  "get",
  (route) =>
    route.handler(async (ctx) => {
      const address = ctx.routeParams.address;

      if (!isValidAddress(address)) {
        return Response.unprocessableEntity();
      }

      const listing = await listingService.getListing(address);

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
  "/listings/:address",
  "patch",
  (route) =>
    route
      .use(withBody(listingSchema.serverEditListing))
      .use(fileMiddleware.generic())
      .handler(async (ctx) => {
        const { userAddress } = ctx.auth;
        const { description } = ctx.body;
        const file = ctx.req.files?.coverFile;

        if (file && !isValidSingleFile(file, 10 * 1024 * 1024)) {
          return Response.unprocessableEntity();
        }

        const patchResult = await listingService.updateOffChainData({
          address: ctx.routeParams.address,
          sellerAddress: userAddress,
          description,
          file,
        });

        if (isErrorResult(patchResult, "unprocessable")) {
          return Response.unprocessableEntity();
        }

        return Response.ok();
      })
);

/**
 * Verifies that a listing is created and exists in the blockchain
 * by checking if it has been indexed by the subgraph
 */
export const verifyListingCreated = authController(
  "/listings/:address/verify",
  "get",
  (route) =>
    route.handler(async (ctx) => {
      const address = ctx.routeParams.address;

      if (!isValidAddress(address)) {
        return Response.unprocessableEntity();
      }

      const listing = await listingService.ensureListingExists(address);

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
  "/listings/user/:address",
  "get",
  (route) =>
    route.use(filterMiddleware.pagination).handler(async (ctx) => {
      const listings = await listingService.getSellerListings({
        sellerAddress: ctx.routeParams.address,
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
