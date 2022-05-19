import type { Call } from "../types";

export const listingMethods = (call: Call) => ({
  mutation: {},
  query: {
    verifyListingExists: (address: string) =>
      call(
        "/listings/:address/verify",
        "get",
        {},
        `/listings/${address}/verify`
      ),

    getSellerListings: (data: { sellerAddress: string; pageParam?: string }) =>
      call(
        "/listings/user/:address",
        "get",
        {
          params: {
            cursor: data.pageParam,
          },
        },
        `/listings/user/${data.sellerAddress}`
      ),

    getListing: (address: string) =>
      call("/listings/:address", "get", {}, `/listings/${address}`),
  },
});
