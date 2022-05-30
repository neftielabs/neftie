import type { Response as TResponse } from "typera-common";
import type { Route } from "typera-express";

import type { RouteManifest } from "./manifest";
import type { WsOpManifest } from "./ws-manifest";

export type { RouteManifest, WsOpManifest };

/**
 * Ensure the manifest's specified response is applicable
 * to a valid Typera's response
 */
export type ApiResponse<
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path],
  Response extends keyof RouteManifest[Path][Method]
> = RouteManifest[Path][Method][Response] extends TResponse.Generic[]
  ? RouteManifest[Path][Method][Response]
  : never;

/**
 * Create a route type based on the manifest's path,
 * method and response
 */
export type ApiRoute<
  URI extends keyof RouteManifest,
  Method extends keyof RouteManifest[URI],
  Response extends keyof RouteManifest[URI][Method] = keyof RouteManifest[URI][Method]
> = Route<ApiResponse<URI, Method, Response>[number]>;
