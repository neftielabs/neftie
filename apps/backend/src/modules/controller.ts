import { route } from "typera-express";
import { CreateController } from "types/controller";

/**
 * Creates a controller that will result in
 * a type-safe route implementation.
 *
 * Expects a path and corresponding method from the
 * route manifest and then expects a function that receives
 * the appropriate context and must return the specified
 * response type.
 */
export const createController: CreateController = (
  path,
  method,
  controller
) => {
  return controller(route(method as any, path));
};
