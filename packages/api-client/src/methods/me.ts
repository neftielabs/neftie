import { meSchema } from "@neftie/common";
import { Asserts } from "yup";
import { Call } from "../types";

export const meMethods = (call: Call) => ({
  mutation: {},
  query: {
    getMe: () => call("/me", "get"),
    uploadAsset: (
      data: Asserts<typeof meSchema["fileUpload"]> & { file: FormData }
    ) => {
      const { file, ...params } = data;
      return call("/me/upload", "post", {
        params,
        data: file,
        headers: {
          "content-type": "multipart/form-data",
        },
      });
    },
  },
});
