import type { UploadedFile } from "express-fileupload";

import type { IListingFull, IListingPreview } from "@neftie/common";
import { areAddressesEqual, isValidAddress } from "@neftie/common";
import type { Prisma } from "@neftie/prisma";
import { listingProvider, userProvider } from "api/providers";
import { dataService } from "api/services";
import { mediaBucket } from "modules/aws/s3-instances";
import Log from "modules/Log";
import logger from "modules/Logger/Logger";
import { subgraphQuery } from "modules/subgraph-client";
import type { Pagination, Result } from "types/helpers";
import { isImage } from "utils/file";

/**
 * Get a listing by its address and merge it
 * with onchain data
 */
export const getListing = async (
  listingId: string
): Promise<IListingFull | null> => {
  const { listing } = await subgraphQuery("getFullListing", {
    id: listingId,
  });

  if (!listing) {
    return null;
  }

  const seller = await userProvider.getById(listing.seller.id);

  const offChainListing = await listingProvider.get({ id: listingId });

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
  listingId: string
): Promise<IListingPreview | null> => {
  const { listing } = await subgraphQuery("getMinimalListing", {
    id: listingId,
  });

  if (!listing) {
    return null;
  }

  // Listing exists, check if we have it ourselves too
  // and if not, create it

  const seller = await userProvider.getById(listing.seller.id);

  const offChainListing = await listingProvider.get({ id: listingId });

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
  sellerId: string;
  pagination: Pagination;
}): Promise<IListingPreview[]> => {
  const { sellerId, pagination } = data;

  const user = await userProvider.getById(sellerId);

  if (!user) {
    return [];
  }

  // Get on-chain listings

  const cursor = isValidAddress(pagination.cursor || "")
    ? pagination.cursor
    : "";

  const onChainListingsData = await subgraphQuery("getSellerMinimalListings", {
    sellerId,
    limit: pagination.limit,
    cursor,
  });

  const onChainListings = onChainListingsData.listings;

  if (!onChainListings || !onChainListings.length) {
    return [];
  }

  // Get off-chain complementary data

  const offChainListings = await listingProvider.getMany({
    sellerId: user.id,
    id: {
      in: onChainListings.map((l) => l.id),
    },
  });

  if (offChainListings.length !== onChainListings.length) {
    logger.warn(`On and off-chain listing count mismatch for user ${user.id}`);
  }

  const listings: IListingPreview[] = [];

  for (const listing of onChainListings) {
    const offChainListing = offChainListings.find((ocListing) =>
      areAddressesEqual(ocListing.id, listing.id)
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

/**
 * Updates off-chain data of a listing
 */
export const updateOffChainData = async (data: {
  listingId: string;
  sellerId: string;
  description?: Record<string, unknown>;
  file?: UploadedFile;
}): Promise<Result<undefined, "noData" | "unprocessable">> => {
  const { sellerId, description, file, listingId } = data;

  if (!description && !file) {
    return {
      success: false,
      error: "noData",
    };
  }

  const seller = await userProvider.getById(sellerId);

  if (!seller) {
    logger.debug("No seller");

    return {
      success: false,
      error: "unprocessable",
    };
  }

  const listing = await listingProvider.get({
    id: listingId,
    sellerId: seller.id,
  });

  if (!listing) {
    logger.debug("No listing");

    return {
      success: false,
      error: "unprocessable",
    };
  }

  const isImageResult = isImage(file);
  let coverUri: string | undefined = undefined;

  try {
    if (file && isImageResult.success) {
      const result = await mediaBucket.upload({
        file: file.data,
        directory: "l",
        extension: isImageResult.data.extension,
        previousFile: listing.coverUri ?? undefined,
      });

      if (result) {
        coverUri = result.key;
      }
    } else if (file && !isImageResult.success) {
      logger.debug("file error");

      return {
        success: false,
        error: "unprocessable",
      };
    }
  } catch (error) {
    new Log("listingService", "updateOffChainData").all(error);
  }

  await listingProvider.update(listingId, seller.id, {
    description: description as
      | Prisma.JsonObject
      | Prisma.NullableJsonNullValueInput,
    coverUri,
  });

  return { success: true };
};
