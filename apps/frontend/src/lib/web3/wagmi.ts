import { chain, configureChains, createClient } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { ALCHEMY_KEY } from "lib/constants/app";

const supportedChains = [chain.goerli, chain.mainnet];

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [alchemyProvider({ alchemyId: ALCHEMY_KEY }), publicProvider()]
);

/**
 * The wagmi client used in the provider.
 * Hosts all chain config.
 */
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});
