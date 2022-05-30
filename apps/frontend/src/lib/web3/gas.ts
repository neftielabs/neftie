import type { BigNumber, Contract, Overrides } from "ethers";

import { GAS_MARGIN } from "lib/constants/web3";

/**
 * Adds GAS_MARGIN % to a given estimated gas (in gas unit) and returns
 * the new estimated gas + gas margin in gas unit.
 */
export const addGasMargin = (estimatedGas: BigNumber) =>
  estimatedGas.add(estimatedGas.mul(GAS_MARGIN).div(100));

/**
 * Wraps a contract call with the gas limits
 * set.
 */
export const withGasMargin = async <
  C extends Contract,
  M extends keyof C["estimateGas"]
>(
  contract: C,
  method: M,
  data: Parameters<C["estimateGas"][M]>,
  overrides?: Overrides
): Promise<ReturnType<C[M]>> => {
  const estimatedGas = await contract.estimateGas[method as any](...data);

  // Add 10% to the estimated gas

  const gasLimit = Math.ceil(addGasMargin(estimatedGas).toNumber());

  if (typeof data[0] === "object" && "value" in data[0] && data.length === 1) {
    const param = data[0];
    return await contract[method]({
      gasLimit,
      ...param,
    });
  }

  return await contract[method](...data, {
    gasLimit,
    ...overrides,
  });
};
