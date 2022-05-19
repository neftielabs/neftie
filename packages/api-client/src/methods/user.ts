import type { Call } from "../types";

export const userMethods = (call: Call) => ({
  mutation: {},
  query: {
    getUser: (addressOrUsername: string) =>
      call(
        "/users/:addressOrUsername",
        "get",
        {},
        `/users/${addressOrUsername}`
      ),
  },
});
