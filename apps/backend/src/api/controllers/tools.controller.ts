import { createController } from "modules/controller";
import { Response } from "typera-express";
import { getEthPrice } from "utils/eth";

/**
 * Get the current ETH to USD price, updated every 20 minutes at most.
 */
export const getCurrentEthPrice = createController(
  "/tools/eth",
  "get",
  (route) =>
    route.handler(async () => {
      const ethPrice = await getEthPrice();

      return Response.ok({
        ethUsdPrice: ethPrice,
      });
    })
);
