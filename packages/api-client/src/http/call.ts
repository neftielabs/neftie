import type { Method as AxiosMethod, AxiosRequestConfig } from "axios";

import { parseRouteParams } from "../utils";
import type { CreateApiClient } from "./types";

export const createApiClient: CreateApiClient =
  (axios) => (url, method, axiosOpts) => {
    let axiosOptions: AxiosRequestConfig | undefined = axiosOpts;
    let requestUrl: string = url;

    if (axiosOpts && "routeParams" in axiosOpts) {
      let routeParams: Record<string, string> = {};

      ({ routeParams, ...axiosOptions } = axiosOpts);

      requestUrl = parseRouteParams(url, routeParams);
    }

    const res = axios(requestUrl, {
      method: method as AxiosMethod,
      ...axiosOptions,
    });

    return res;
  };
