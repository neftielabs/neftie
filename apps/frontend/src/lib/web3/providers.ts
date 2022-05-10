import { providers } from "ethers";
import { ALCHEMY_KEY } from "lib/constants/app";
import { Connector, chain } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const supportedChains = [chain.goerli, chain.mainnet];

/**
 * Check if the used chain is within our
 * supported ones
 */
const isChainSupported = (chainId?: number) => {
  return !!supportedChains.find((c) => c.id === chainId);
};

/**
 * Allowed connectors
 */
export const connectors = [
  new InjectedConnector({
    chains: supportedChains,
    options: {
      shimDisconnect: true,
    },
  }),
];

/**
 * The default provider connects to multiple backends and verifies their results internally,
 * making it simple to have a high level of trust in third-party services.
 *
 * @see https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider
 */
export const getDefaultProvider = (data: {
  chainId?: number;
  connector?: Connector;
}) => {
  let chainId = data.chainId;

  if (!isChainSupported(chainId)) {
    chainId = chain.mainnet.id;
  }

  return providers.getDefaultProvider(chainId, {
    alchemy: ALCHEMY_KEY,
  });
};
