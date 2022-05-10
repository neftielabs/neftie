import { listingSchema } from "@neftie/common";
import { Listing } from "@neftie/prisma";
import { listingProvider, userProvider } from "api/providers";
import { UploadedFile } from "express-fileupload";
import { mediaBucket } from "modules/aws/s3-instances";
import { withLog } from "modules/Log";
import { graph } from "modules/thegraph";
import { Result } from "types/helpers";
import { isImage } from "utils/file";
import { Asserts } from "yup";

/**
 * Verify that a given listing exists on the blockchain
 * by querying the subgraph by the predicted listing address..
 */
export const ensureListingExists = async (address: string) => {
  const { listing } = await graph.listings.getById(address);
  return listing;
};

/**
 * Register a new listing storing all off-chain data
 * like cover and description. Storing them on-chain
 * would result on higher transaction fees and the listing
 * can work without it.
 */
export const createListing = withLog(
  async (
    log,
    data: {
      body: Asserts<typeof listingSchema["serverCreateListing"]>;
      file?: UploadedFile;
      userId: string;
    }
  ): Promise<
    Result<{ exists?: boolean; listing: Listing }, "noUser" | "noListing">
  > => {
    log.setTargets("listingService", "createListing");

    const { body, file, userId } = data;

    const user = await userProvider.getById(userId);
    if (!user) {
      return {
        success: false,
        error: "noUser",
      };
    }

    // Verify listing doesn't exist

    const existingListing = await listingProvider.get({
      nonce: body.nonce,
      tx: body.txHash,
      sellerId: user.id,
      address: body.predictedAddress,
    });

    if (existingListing !== null) {
      return {
        success: true,
        data: {
          exists: true,
          listing: existingListing,
        },
      };
    }

    // Verify listing exists on-chain

    const chainListing = await ensureListingExists(body.predictedAddress);
    if (!chainListing || chainListing.seller.id !== user.address) {
      return {
        success: false,
        error: "noListing",
      };
    }

    // Store cover

    let coverUri: string | null = null;

    if (file) {
      const isImageResult = isImage(file.name);

      if (isImageResult.success) {
        try {
          const result = await mediaBucket.upload({
            file: file.data,
            directory: "l/covers",
            extension: isImageResult.extension,
          });

          if (result) coverUri = result.key;
        } catch (error) {
          log.all(error);
        }
      }
    }

    // Create listing

    const listing = await listingProvider.create({
      sellerId: user.id,
      nonce: body.nonce,
      address: body.predictedAddress,
      isConfirmed: true,
      tx: body.txHash,
      description: body.description,
      coverUri,
    });

    return {
      success: true,
      data: {
        listing,
      },
    };
  }
);
