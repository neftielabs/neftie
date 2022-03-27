import { authSchema } from "@neftie/common";
import { Asserts } from "yup";
import { Call } from "../types";

export const authMethods = (call: Call) => ({
  mutation: {
    verifyMessage: (data: Asserts<typeof authSchema["verifyPayload"]>) =>
      call("/auth/verify", "post", { data }),
  },
  query: {
    getNonce: () => call("/auth/nonce", "get"),
  },
});
