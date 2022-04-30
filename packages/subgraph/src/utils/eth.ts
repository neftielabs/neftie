import { BigInt } from "@graphprotocol/graph-ts";
import { ONE_ETH_IN_WEI } from "./constants";

/**
 * Converts Wei to Ether
 */
export const weiToEth = (amount: BigInt): BigInt => {
  return amount.div(ONE_ETH_IN_WEI);
};
