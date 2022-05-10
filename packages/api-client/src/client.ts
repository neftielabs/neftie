import { AxiosInstance } from "axios";
import { createApiClient } from "./call";
import { authMethods } from "./methods/auth";
import { listingMethods } from "./methods/listing";
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
      ...listingMethods(call).mutation,
    },
    query: {
      ...userMethods(call).query,
      ...authMethods(call).query,
      ...meMethods(call).query,
      ...listingMethods(call).query,
    },
  };
};
