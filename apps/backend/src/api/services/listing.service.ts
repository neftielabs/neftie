import type { ListingFull, ListingPreview } from "@neftie/common";
import { areAddressesEqual, isValidAddress } from "@neftie/common";
import { listingProvider, userProvider } from "api/providers";
import { dataService } from "api/services";
import logger from "modules/Logger/Logger";
import { subgraphProvider } from "modules/subgraph-client";
import type { Pagination } from "types/helpers";

/**
 * Get a listing by its address and merge it
 * with onchain data
 */
export const getListing = async (
  address: string
): Promise<ListingFull | null> => {
  const { listing } = await subgraphProvider.getFullListing({
    address,
  });

  if (!listing) {
    return null;
  }

  const seller = await userProvider.getByAddress(listing.seller.id);

  const offChainListing = await listingProvider.get({ address });

  return await dataService.mergeFullListing({
    onChain: listing,
    offChain: offChainListing,
    user: seller,
  });
};

/**
 * Verify that a given listing exists on the blockchain
 * by querying the subgraph by the predicted listing address..
 */
export const ensureListingExists = async (
  address: string
): Promise<ListingPreview | null> => {
  const { listing } = await subgraphProvider.getMinimalListing({
    address: address.toLowerCase(),
  });

  if (!listing) {
    return null;
  }

  // Listing exists, check if we have it ourselves too
  // and if not, create it

  const seller = await userProvider.getByAddress(listing.seller.id);

  const offChainListing = await listingProvider.get({ address });

  return await dataService.mergeMinimalListing({
    onChain: listing,
    offChain: offChainListing,
    user: seller,
  });
};

/**
 * Gets all listings from a seller.
 * First gets on-chain data from the subgraph and then
 * combines it with off-chain data
 */
export const getSellerListings = async (data: {
  sellerAddress: string;
  pagination: Pagination;
}): Promise<ListingPreview[]> => {
  const { sellerAddress, pagination } = data;

  const user = await userProvider.getByAddress(sellerAddress);

  if (!user) {
    return [];
  }

  // Get on-chain listings

  const cursor = isValidAddress(pagination.cursor || "")
    ? pagination.cursor
    : "";

  const onChainListingsData = await subgraphProvider.getSellerMinimalListings({
    sellerAddress: sellerAddress.toLowerCase(),
    limit: pagination.limit,
    cursor,
  });

  const onChainListings = onChainListingsData.seller?.listings;

  if (!onChainListings || !onChainListings.length) {
    return [];
  }

  // Get off-chain complementary data

  const addresses = onChainListings.map((l) => l.id);
  const offChainListings = await listingProvider.getMany({
    sellerId: user.id,
    address: {
      in: addresses,
    },
  });

  if (offChainListings.length !== onChainListings.length) {
    logger.warn(`On and off-chain listing count mismatch for user ${user.id}`);
  }

  const listings: ListingPreview[] = [];

  for (const listing of onChainListings) {
    const offChainListing = offChainListings.find((o) =>
      areAddressesEqual(o.address, listing.id)
    );

    listings.push(
      await dataService.mergeMinimalListing({
        onChain: listing,
        offChain: offChainListing,
        user,
      })
    );
  }

  return listings;
};
