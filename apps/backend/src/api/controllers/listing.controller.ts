import { isValidAddress } from "@neftie/common";
import { authMiddleware } from "api/middleware";
import { listingService } from "api/services";
import AppError from "errors/AppError";
import { createReusableController } from "modules/controller";
import { Response, applyMiddleware } from "typera-express";
import { httpResponse } from "utils/http";

const authController = createReusableController(
  applyMiddleware(authMiddleware.withAuth("required"))
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
      if (!isValidAddress(ctx.routeParams.address)) {
        throw new AppError(httpResponse("BAD_REQUEST"));
      }

      const listing = await listingService.ensureListingExists(
        ctx.routeParams.address
      );

      if (!listing) {
        return Response.notFound();
      }

      return Response.ok(listing.id);
    })
);

/**
 * Create a new listing.
 * Receives the transaction hash, nonce used and some data
 * that is stored off-chain (such as the cover image and description).
 */
// export const createListing = authController("/listings", "post", (route) =>
//   route
//     .use(withBody(listingSchema.serverCreateListing))
//     .use(
//       fileMiddleware.generic({
//         limits: { fileSize: 10 * 1024 * 1024 },
//       })
//     )
//     .handler(async (ctx) => {
//       const file = ctx.req.files?.file;

//       if (!isValidSingleFile(file, 10 * 1024 * 1024)) {
//         throw new AppError(httpResponse("BAD_REQUEST"));
//       }

//       const result = await listingService.createListing({
//         body: ctx.body,
//         file,
//         userId: ctx.auth.userId,
//       });

//       if (!result.success) {
//         if (result.error === "noUser") {
//           throw new AppError(httpResponse("BAD_REQUEST"));
//         }

//         // Listing was not found on the blockchain
//         // We just send a null listing and wait for another request
//         // to be sent

//         return Response.ok({
//           listing: null,
//         });
//       }

//       if (result.data.exists) {
//         return Response.ok({
//           listing: result.data.listing,
//         });
//       }

//       return Response.created({
//         listing: result.data.listing,
//       });
//     })
// );
