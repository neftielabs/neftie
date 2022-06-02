import fetchAdapter from "@vespaiach/axios-fetch-adapter";

import { apiClient } from "@neftie/api-client";
import axiosInstance from "lib/http/axiosInstance";

export const serverClient = () => {
  axiosInstance.defaults.adapter = fetchAdapter;
  return apiClient(axiosInstance);
};
