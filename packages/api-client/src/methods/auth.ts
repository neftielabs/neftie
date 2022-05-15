import { authSchema } from "@neftie/common";
import { Asserts } from "yup";
import { Call } from "../types";

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
