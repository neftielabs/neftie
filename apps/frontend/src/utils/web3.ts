import { isProd } from "utils/app";

/**
 * Transforms it to something like 0x32a...45f
 */
export const shortenAddress = (address: string, first = 6, last = 3) =>
  address.slice(0, first) + "..." + address.slice(last * -1);

/**
 * This is used to create new listings, where the seller + nonce
 * combination must be unique. It is not bulletproof since collisions
 * can happen, but should be good for now.
 */
export const getNumericNonce = () => Math.floor(Math.random() * 10000000);

/**
 * Get a link to a transaction
 */
export const getEtherscanLink = (
  data: { tx: string } | { address: string }
) => {
  const chain = isProd ? "" : "goerli.";
  return `https://${chain}etherscan.io/${Object.keys(data)[0]}/${
    Object.values(data)[0]
  }`;
};
