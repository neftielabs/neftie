import type { ListingFull, ListingPreview } from "@neftie/common";
import type { Listing, Order, User } from "@neftie/prisma";
import type {
  ListingFullFragment,
  ListingMinimalFragment,
  OrderMinimalFragment,
} from "@neftie/subgraph";
import { listingProvider, orderProvider, userProvider } from "api/providers";
import Log from "modules/Log";
import { pick } from "utils/pick";
import { getMediaUrl } from "utils/url";

/**
 * Merge an off-chain preview listing with
 * on-chain data
 */
export const mergeMinimalListing = async (data: {
  onChain: ListingMinimalFragment;
  offChain?: Listing | null;
  user?: User | null;
}): Promise<ListingPreview> => {
  const { onChain } = data;
  let { offChain, user } = data;

  if (!user) {
    user = await userProvider.getByAddress(onChain.seller.id);
  }

  if (!offChain && user) {
    try {
      offChain = await listingProvider.create({
        address: onChain.id,
        sellerId: user?.id || onChain.seller.id,
        isExternal: true,
      });
    } catch (error) {
      new Log("dataService", "mergeMinimalListing").all(error);
    }
  }

  return {
    ...onChain,
    coverUrl: getMediaUrl(offChain?.coverUri ?? null),
    description: offChain?.description ?? null,
    seller: {
      ...onChain.seller,
      user: user
        ? {
            ...pick(user, ["address", "username"]),
            avatarUrl: getMediaUrl(user.avatarUri),
          }
        : null,
    },
  };
};

/**
 * Merge off-chain full listing with
 * on-chain data
 */
export const mergeFullListing = async (data: {
  onChain: ListingFullFragment;
  offChain?: Listing | null;
  user?: User | null;
}): Promise<ListingFull> => {
  const { onChain } = data;
  let { offChain, user } = data;

  if (!user) {
    user = await userProvider.getByAddress(onChain.seller.id);
  }

  if (!offChain && user) {
    try {
      offChain = await listingProvider.create({
        address: onChain.id,
        sellerId: user?.id || onChain.seller.id,
        isExternal: true,
      });
    } catch (error) {
      new Log("dataService", "mergeFullListing").all(error);
    }
  }

  return {
    ...onChain,
    coverUrl: getMediaUrl(offChain?.coverUri ?? null),
    description: offChain?.description ?? null,
    orders: [],
    seller: {
      ...onChain.seller,
      user: user
        ? {
            ...pick(user, ["address", "username"]),
            avatarUrl: getMediaUrl(user.avatarUri),
          }
        : null,
    },
  };
};

/**
 * Merge off-chain minimal order with on-chain data
 */
export const mergeMinimalOrder = async (data: {
  onChain: OrderMinimalFragment & { listingId?: number };
  offChain?: Order | null;
  client?: User | null;
}) => {
  let { offChain } = data;
  const { onChain, client } = data;

  if (!offChain && client && onChain.listingId) {
    try {
      offChain = await orderProvider.create({
        hexId: onChain.id,
        tx: onChain.tx,
        listingId: onChain.listingId,
      });
    } catch (error) {
      new Log("dataService", "mergeMinimalOrder").all(error);
    }
  }

  return {
    ...onChain,
  };
};
