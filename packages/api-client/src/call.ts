import { Method as AxiosMethod } from "axios";
import { CreateApiClient } from "./types";

export const createApiClient: CreateApiClient =
  (axios) => (url, method, axiosOpts, realUrl) => {
    const res = axios(String(realUrl || url), {
      method: method as AxiosMethod,
      ...axiosOpts,
    });

    return res;
  };
