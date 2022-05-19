import { apiClient } from "@neftie/api-client";
import axiosInstance from "lib/http/axiosInstance";

export const serverClient = () => {
  return apiClient(axiosInstance);
};
