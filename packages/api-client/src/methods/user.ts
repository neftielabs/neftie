import { Call } from "../types";

export const userMethods = (call: Call) => ({
  mutation: {},
  query: {
    getMe: () => call("/me", "get"),
  },
});
