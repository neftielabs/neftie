import type { RouteFn } from "typera-common";
import type { Response } from "typera-express";
import { route as typeraRoute } from "typera-express";

import type { ApiRoute, RouteManifest } from "@neftie/common";
import type { ControllerFn } from "types/controller";

/**
 * Creates a controller that will result in
 * a type-safe route implementation. A route can be
 * provided to avoid repeating middlewares each time.
 *
 * Generics:
 *  - P: API path
 *  - M: http method
 *  - R: Response type
 *  - K: Provided route type
 */

// Overload 1
// Function with a provided route

export function createController<
  P extends keyof RouteManifest,
  M extends keyof RouteManifest[P],
  R extends keyof RouteManifest[P][M],
  K extends RouteFn<unknown, unknown, Response.Generic>
>(
  path: P,
  method: M,
  route: K,
  controller: ControllerFn<P, M, R, K>
): ApiRoute<P, M, R>;

// Overload 2
// Function without a provided route

export function createController<
  P extends keyof RouteManifest,
  M extends keyof RouteManifest[P],
  R extends keyof RouteManifest[P][M],
  K extends RouteFn<unknown, unknown, Response.Generic>
>(path: P, method: M, controller: ControllerFn<P, M, R, K>): ApiRoute<P, M, R>;

// Overload 3
// Final

export function createController<
  P extends keyof RouteManifest,
  M extends keyof RouteManifest[P],
  R extends keyof RouteManifest[P][M],
  K extends RouteFn<unknown, unknown, Response.Generic>
>(
  path: P,
  method: M,
  controllerOrRoute: ControllerFn<P, M, R, K> | K,
  possibleController?: ControllerFn<P, M, R, K>
): ApiRoute<P, M, R> {
  if (
    controllerOrRoute instanceof Function &&
    !("useParamConversions" in controllerOrRoute)
  ) {
    // Route was not provided, use typera's

    const controller = controllerOrRoute;
    return controller(typeraRoute(method as any, path) as any);
  }

  // Route was provided, use that one

  const controller = possibleController!;
  const providedRoute = controllerOrRoute;
  return controller(providedRoute(method as any, path) as any);
}

/**
 * Create a controller that reuses the same
 * middleware.
 */
export const createReusableController = <
  K extends RouteFn<unknown, unknown, Response.Generic>
>(
  route: K
) => {
  return <
    P extends keyof RouteManifest,
    M extends keyof RouteManifest[P],
    R extends keyof RouteManifest[P][M]
  >(
    path: P,
    method: M,
    controller: ControllerFn<P, M, R, K>
  ) => createController<P, M, R, K>(path, method, route, controller);
};
