import { AxiosInstance } from "axios";
import { createApiClient } from "./call";
import { authMethods } from "./methods/auth";
import { meMethods } from "./methods/me";
import { userMethods } from "./methods/user";

export const apiClient = (axios: AxiosInstance) => {
  const call = createApiClient(axios);

  return {
    call,
    mutation: {
      ...userMethods(call).mutation,
      ...authMethods(call).mutation,
      ...meMethods(call).mutation,
    },
    query: {
      ...userMethods(call).query,
      ...authMethods(call).query,
      ...meMethods(call).query,
    },
  };
};
