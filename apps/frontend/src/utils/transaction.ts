import { isProd } from "utils/app";

export const getEtherscanLink = (txHash: string) => {
  const chain = isProd ? "" : "goerli.";
  return `https://${chain}etherscan.io/tx/${txHash}`;
};
