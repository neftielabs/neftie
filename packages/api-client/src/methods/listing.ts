import type { Asserts } from "yup";

import type { listingSchema } from "@neftie/common";

import type { Call } from "../types";

export const listingMethods = (call: Call) => ({
  mutation: {
    updateListing: (
      address: string,
      data: Asserts<typeof listingSchema["editListing"]>
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
        formData.append("description", data.description);
      }

      return call("/listings/:address", "patch", {
        realUrl: `/listings/${address}`,
        data: formData,
        headers: {
          "content-type": "multipart/from-data",
        },
      });
    },
  },
  query: {
    verifyListingExists: (address: string) =>
      call("/listings/:address/verify", "get", {
        realUrl: `/listings/${address}/verify`,
      }),

    getSellerListings: (data: { sellerAddress: string; pageParam?: string }) =>
      call("/listings/user/:address", "get", {
        realUrl: `/listings/user/${data.sellerAddress}`,
        params: {
          cursor: data.pageParam,
        },
      }),

    getListing: (address: string) =>
      call("/listings/:address", "get", {
        realUrl: `/listings/${address}`,
      }),
  },
});
