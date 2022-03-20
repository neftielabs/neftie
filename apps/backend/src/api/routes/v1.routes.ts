import { typedObjectKeys } from "@neftie/common";
import { healthController } from "api/controllers";
import { Route, router as typeraRouter } from "typera-express";
import { Generic } from "typera-express/response";

/**
 * Controllers to create routes from
 */
const controllers = {
  ...healthController,
};

/**
 * Generate an express router from all
 * typera controllers
 */
const generateRouter = () => {
  const routeArr: Route<Generic>[] = [];

  typedObjectKeys(controllers).forEach((controller) => {
    routeArr.push(controllers[controller]);
  });

  return typeraRouter(...routeArr).handler();
};

/**
 * The express router
 */
export const v1Router = generateRouter();
