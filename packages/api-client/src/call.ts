import type { Method as AxiosMethod, AxiosRequestConfig } from "axios";

import type { CreateApiClient } from "./types";

export const createApiClient: CreateApiClient =
  (axios) => (url, method, axiosOpts) => {
    let axiosOptions: AxiosRequestConfig | undefined = undefined;
    let realUrl: string | undefined = undefined;

    if (axiosOpts) {
      ({ realUrl, ...axiosOptions } = axiosOpts);
    }

    const res = axios(String(realUrl || url), {
      method: method as AxiosMethod,
      ...axiosOptions,
    });

    return res;
  };
