import { config } from "config/main";
import { GraphQLClient } from "graphql-request";

/**
 * GraphQL client for interacting with
 * our The Graph subgraph.
 */
export const graphClient = new GraphQLClient(config.external.thegraph.endpoint);
