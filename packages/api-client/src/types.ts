import type { AxiosInstance, AxiosRequestConfig } from "axios";

import type { RouteManifest } from "@neftie/common";

type ApiResponse<
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path]
> = Extract<
  RouteManifest[Path][Method],
  { response: any }
>["response"][0]["body"];

export type Call = <
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path]
>(
  url: Path,
  method: Method,
  axiosOpts?: AxiosRequestConfig,
  realUrl?: string
) => Promise<ApiResponse<Path, Method>>;

export type CreateApiClient = (axios: AxiosInstance) => Call;
