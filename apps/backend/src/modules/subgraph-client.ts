import { config } from "config/main";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "@neftie/subgraph";

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
