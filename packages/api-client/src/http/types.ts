/* eslint-disable @typescript-eslint/ban-types */
import type { AxiosInstance, AxiosRequestConfig } from "axios";

import type { RouteManifest } from "@neftie/common";

type ApiResponse<
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path]
> = Extract<
  RouteManifest[Path][Method],
  { response: any }
>["response"][0]["body"];

/**
 * Create object from param tuple.
 * @see https://github.com/akheron/typera - Original implementation
 */
type ParamsFrom<Parts> = Parts extends [infer First, ...infer Rest]
  ? First extends `:${infer Param}`
    ? { [K in Param]: string } & ParamsFrom<Rest>
    : ParamsFrom<Rest>
  : {};

/**
 * Extract params form a path.
 * @see https://github.com/akheron/typera - Original implementation
 */
type SplitParams<Input> = Input extends `${infer First}/${infer Rest}`
  ? [First, ...SplitParams<Rest>]
  : [Input];

type CallOpts<Path> = Path extends `${any}:${any}`
  ? {
      routeParams: ParamsFrom<SplitParams<Path>>;
    }
  : {};

export type Call = <
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path]
>(
  url: Path,
  method: Method,
  axiosOpts?: AxiosRequestConfig & CallOpts<Path>
) => Promise<ApiResponse<Path, Method>>;

export type CreateApiClient = (axios: AxiosInstance) => Call;
