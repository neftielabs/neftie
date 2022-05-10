import { gql } from "graphql-request";
import { graphClient } from "modules/thegraph/client";

export const getById = (id: string) => {
  const query = gql`
    query getListing($id: String!) {
      listing(id: $id) {
        id
        seller {
          id
        }
      }
    }
  `;

  return graphClient.request<{
    listing: { id: string; seller: { id: string } } | null;
  }>(query, { id });
};
