import { GraphQLClient } from "graphql-request";

import { getSdk } from "@neftie/subgraph";
import { config } from "config/main";
import logger from "modules/Logger/Logger";

const { endpoint } = config.external.subgraph;

/**
 * GraphQL client for raw interacting with
 * our subgraph.
 */
export const subgraphClient = new GraphQLClient(endpoint);

/**
 * Generated client with type-safe predefined queries
 */
export const subgraphProvider = getSdk(subgraphClient);

type SubgraphProvider = typeof subgraphProvider;

/**
 * Wrapper for the subgraph provider to convert all addresses
 * to lowercase, since that's how TheGraph works.
 */
export const subgraphQuery = <Q extends keyof SubgraphProvider>(
  query: Q,
  args: Parameters<SubgraphProvider[Q]>[0]
): ReturnType<SubgraphProvider[Q]> => {
  const safeArgs = JSON.parse(
    JSON.stringify(args).replace(/\b(0x[a-fA-F0-9]{40})\b/g, (a) => {
      logger.debug(`[subgraphQuery] Matched ${a}`);
      return a.toLowerCase();
    })
  ) as Parameters<SubgraphProvider[Q]>[0];

  // so close :/
  return subgraphProvider[query](safeArgs as any) as ReturnType<
    SubgraphProvider[Q]
  >;
};
