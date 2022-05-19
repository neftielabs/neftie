import axios, { AxiosError, AxiosInstance } from "axios";
import { API_BASEURL } from "lib/constants/app";
import { ApiError } from "lib/http/ApiError";

/**
 * Reusable Axios instance for easy interaction with
 * the backend API
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Request interceptor.
 * Modify the request after being sent and before
 * it reaching the server.
 */
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => {
    Promise.reject(error);
  }
);

/**
 * Extract axios error
 */
const extractError = (err: any) =>
  err.response && err.response.data.message
    ? new ApiError(err.response.data)
    : err;

/**
 * Response interceptor.
 * Modify the server response before it reaching
 * the client.
 */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message: string }>) => {
    return Promise.reject(extractError(error));
  }
);

export default axiosInstance;
