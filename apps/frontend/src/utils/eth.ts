import { BigNumber, BigNumberish } from "ethers";
import { ONE_ETH_IN_WEI } from "lib/constants/web3";

/**
 * Converts Ether to Wei
 */
export const ethToWei = (amount: BigNumberish) =>
  BigNumber.from(amount).mul(ONE_ETH_IN_WEI);
