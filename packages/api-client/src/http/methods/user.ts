import type { Call } from "../types";

export const userMethods = (call: Call) => ({
  mutation: {},
  query: {
    getUser: (userIdOrUsername: string) =>
      call("/users/:userIdOrUsername", "get", {
        routeParams: {
          userIdOrUsername,
        },
      }),
    checkUsernameAvailable: (username: string) =>
      call("/users/:username/available", "get", {
        routeParams: {
          username,
        },
      }),
  },
});
