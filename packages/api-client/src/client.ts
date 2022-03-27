import { AxiosInstance } from "axios";
import { createApiClient } from "./call";
import { authMethods } from "./methods/auth";
import { userMethods } from "./methods/user";

export const apiClient = (axios: AxiosInstance) => {
  const call = createApiClient(axios);

  return {
    call,
    mutation: {
      user: userMethods(call).mutation,
      auth: authMethods(call).mutation,
    },
    query: {
      user: userMethods(call).query,
      auth: authMethods(call).query,
    },
  };
};
