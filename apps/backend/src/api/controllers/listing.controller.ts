import { isValidAddress } from "@neftie/common";
import { authMiddleware, filterMiddleware } from "api/middleware";
import { listingService } from "api/services";
import { createController, createReusableController } from "modules/controller";
import { Response, applyMiddleware } from "typera-express";
import { withPagination } from "utils/helpers";

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
