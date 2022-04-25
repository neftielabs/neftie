import { Call } from "../types";

export const userMethods = (call: Call) => ({
  mutation: {},
  query: {
    getMe: () => call("/me", "get"),
    getUser: (username: string) =>
      call("/users/:username", "get", {}, `/users/${username}`),
  },
});
