import type { MakeRoute, RouteFn } from "typera-common";
import type { RequestBase, Response as TResponse } from "typera-express";
import type { BuiltinConversions } from "typera-express/url";

import type { ApiResponse, ApiRoute, RouteManifest } from "@neftie/common";

/**
 * Extract the context from a provided route
 */
type GetAdditionalContext<R> = R extends RouteFn<any, infer Response, any>
  ? Response & RequestBase
  : RequestBase;

/**
 * The route implementation function signature
 * (the controller)
 */
export type ControllerFn<
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path],
  Response extends keyof RouteManifest[Path][Method],
  ProvidedRoute extends RouteFn<unknown, unknown, TResponse.Generic>
> = (
  route: MakeRoute<
    GetAdditionalContext<ProvidedRoute>,
    BuiltinConversions,
    Path,
    ApiResponse<Path, Method, Response>[number]
  >
) => ApiRoute<Path, Method, Response>;
