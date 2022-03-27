import * as controllerGroups from "api/controllers";
import { Route, router as typeraRouter } from "typera-express";
import { Generic } from "typera-express/response";
import { typedObjectKeys } from "@neftie/common";

/**
 * Generate an express router from all
 * typera controllers
 */
const generateRouter = () => {
  const routeArr: Route<Generic>[] = [];

  typedObjectKeys(controllerGroups).forEach((controllerGroup) => {
    const group = controllerGroups[controllerGroup];
    typedObjectKeys(group).forEach((controller) => {
      routeArr.push(group[controller]);
    });
  });

  return typeraRouter(...routeArr).handler();
};

/**
 * The express router
 */
export const v1Router = generateRouter();
