import axiosInstance from "lib/http/axiosInstance";

import { apiClient } from "@neftie/api-client";

export const serverClient = () => {
  return apiClient(axiosInstance);
};
