import type { Contract, Overrides } from "ethers";

import { GAS_MARGIN } from "lib/constants/web3";

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

  const gasLimit = Math.ceil(
    estimatedGas.add(estimatedGas.mul(GAS_MARGIN).div(100)).toNumber()
  );

  return await contract[method](...data, {
    gasLimit,
    ...overrides,
  });
};
