import type { Asserts } from "yup";

import type { listingSchema } from "@neftie/common";

import type { Call } from "../types";

export const listingMethods = (call: Call) => ({
  mutation: {
    updateListing: (
      listingId: string,
      data: Asserts<typeof listingSchema["serverEditListing"]>
    ) => {
      const file = data.coverFile as File;

      if (!file && !data.description) {
        return;
      }

      const formData = new FormData();

      if (file) {
        formData.append("coverFile", file);
      }

      if (data.description) {
        formData.append("description", JSON.stringify(data.description));
      }

      return call("/listings/:listingId", "patch", {
        data: formData,
        headers: {
          "content-type": "multipart/from-data",
        },
        routeParams: {
          listingId,
        },
      });
    },
  },
  query: {
    verifyListingExists: (listingId: string) =>
      call("/listings/:listingId/verify", "get", {
        routeParams: {
          listingId,
        },
      }),

    getSellerListings: (data: { sellerId: string; pageParam?: string }) =>
      call("/users/:userId/listings", "get", {
        routeParams: {
          userId: data.sellerId,
        },
        params: {
          cursor: data.pageParam,
        },
      }),

    getListing: (listingId: string) =>
      call("/listings/:listingId", "get", {
        routeParams: {
          listingId,
        },
      }),
  },
});
