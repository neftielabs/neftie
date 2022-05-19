import { date } from "@neftie/common";
import axios, { AxiosResponse } from "axios";
import { config } from "config/main";
import Log from "modules/Log";
import logger from "modules/Logger/Logger";
import { isProd } from "utils/constants";

type CmcResponse = {
  status: {
    error_code: number;
  };
  data: {
    quote: {
      USD: {
        price: number;
      };
    };
  }[];
};

let ethPrice: { value: number; expiresAt: Date } | null = isProd
  ? null
  : {
      value: 2004.1963082211591,
      expiresAt: date.addDays(365),
    };

/**
 * The current ETH to USD price, updated
 * every 20 minutes.
 *
 * While this would be kept cached in Redis, there's
 * no need to throw in another service at this point.
 *
 * We'll keep it in memory and move it to Redis once we have
 * a solid reason to add it to the current infrastructure.
 */
export const getEthPrice = async () => {
  if (ethPrice && !date.isExpired(ethPrice.expiresAt)) {
    return ethPrice.value;
  }

  // Fetch the current price

  try {
    logger.debug("Requesting ETH price to CMC");

    const response: AxiosResponse<CmcResponse> = await axios(
      "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
      {
        method: "get",
        params: {
          amount: 1,
          symbol: "ETH",
          convert: "USD",
        },
        headers: {
          "X-CMC_PRO_API_KEY": config.external.coinmarketcap.apikey,
        },
      }
    );

    ethPrice = {
      value: response.data.data[0].quote.USD.price,
      expiresAt: date.addSeconds(60 * 20),
    };

    return ethPrice.value;
  } catch (error) {
    new Log("eth utils", "getEthPrice").all(error);
  }

  return 0;
};
