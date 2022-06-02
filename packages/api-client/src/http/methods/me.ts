import type { Asserts } from "yup";

import type { meSchema } from "@neftie/common";

import type { Call } from "../types";

export const meMethods = (call: Call) => ({
  mutation: {},
  query: {
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
