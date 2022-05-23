import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { ONE_ETH_IN_WEI } from "./constants";

/**
 * Converts Wei to Ether
 */
export const weiToEth = (amount: BigInt): BigDecimal => {
  return amount.toBigDecimal().div(ONE_ETH_IN_WEI.toBigDecimal());
};
