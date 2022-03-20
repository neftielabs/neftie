import { MakeRoute } from "typera-common";
import { RequestBase } from "typera-express";
import { BuiltinConversions } from "typera-express/url";
import { ApiResponse, ApiRoute, RouteManifest } from "@neftie/common";

/**
 * Function signature of `createController`.
 */
export type CreateController = <
  Path extends keyof RouteManifest,
  Method extends keyof RouteManifest[Path],
  Response extends keyof RouteManifest[Path][Method]
>(
  path: Path,
  method: Method,
  cb: (
    route: MakeRoute<
      RequestBase,
      BuiltinConversions,
      Path,
      ApiResponse<Path, Method, Response>[number]
    >
  ) => ApiRoute<Path, Method, Response>
) => ApiRoute<Path, Method, Response>;
