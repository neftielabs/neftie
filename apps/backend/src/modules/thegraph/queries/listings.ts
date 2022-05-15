import { ListingMinimal } from "@neftie/common";
import { gql } from "graphql-request";
import { graphClient } from "modules/thegraph/client";

/**
 * Get a listing by its address
 */
export const getById = (id: string) => {
  const query = gql`
    query getListing($id: String!) {
      listing(id: $id) {
        id
        title
        price
        seller {
          id
        }
      }
    }
  `;

  return graphClient.request<{
    listing: ListingMinimal | null;
  }>(query, { id });
};

/**
 * Get all listings from a seller
 */
export const getBySeller = (address: string) => {
  const query = gql`
    query getUserListings()
  `;
};
