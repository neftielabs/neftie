import type { Asserts } from "yup";

import type { authSchema } from "@neftie/common";

import type { Call } from "../types";

export const authMethods = (call: Call) => ({
  mutation: {
    authConnect: (data: Asserts<typeof authSchema["verifyPayload"]>) =>
      call("/auth/connect", "post", { data }),

    getAuthToken: () => call("/auth/token", "post"),

    disconnect: () => call("/auth/disconnect", "post"),

    getNonce: () => call("/auth/nonce", "post"),
  },
  query: {},
});
