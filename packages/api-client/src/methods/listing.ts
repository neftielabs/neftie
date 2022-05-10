import { listingSchema, typedObjectKeys } from "@neftie/common";
import { Asserts } from "yup";
import { Call } from "../types";

export const listingMethods = (call: Call) => ({
  mutation: {
    createListing: (
      data: Asserts<typeof listingSchema["serverCreateListing"]>
    ) => {
      const formData = new FormData();

      typedObjectKeys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      return call("/listings", "post", {
        data: formData,
        headers: {
          "content-type": "multipart/form-data",
        },
      });
    },
  },
  query: {
    verifyListingExists: (address: string) =>
      call(
        "/listings/:address/verify",
        "get",
        {},
        `/listings/${address}/verify`
      ),
  },
});
