import type {
  IListingFull,
  IListingPreview,
  IOrderEvent,
  IOrderFull,
  IOrderPreview,
  MergedUser,
} from "@neftie/common";
import { areAddressesEqual } from "@neftie/common";
import type {
  Listing,
  Order,
  OrderMessage,
  Prisma,
  User,
} from "@neftie/prisma";
import type {
  ListingFullFragment,
  ListingMinimalFragment,
  OrderFullFragment,
  OrderMinimalFragment,
} from "@neftie/subgraph";
import { listingProvider, orderProvider, userProvider } from "api/providers";
import Log from "modules/Log";
import { splitOrderId } from "utils/helpers";
import { pick } from "utils/pick";
import { getMediaUrl } from "utils/url";

const mergeUser = (data: {
  onChain: { id: string };
  offChain?: User | null;
}): MergedUser => {
  const { onChain, offChain } = data;

  return {
    ...onChain,
    user: offChain
      ? {
          ...pick(offChain, ["id", "username", "verified"]),
          avatarUrl: getMediaUrl(offChain.avatarUri),
        }
      : null,
  };
};

export const getFrom = (
  order: OrderFullFragment | OrderMinimalFragment,
  id: string
): "client" | "seller" =>
  areAddressesEqual(id, order.seller.id) ? "seller" : "client";

const stringifyDescription = (description?: Prisma.JsonValue | null) =>
  description ? JSON.stringify(description) : null;

/**
 * Merge an off-chain preview listing with
 * on-chain data
 */
export const mergeMinimalListing = async (data: {
  onChain: ListingMinimalFragment;
  offChain?: Listing | null;
  user?: User | null;
}): Promise<IListingPreview> => {
  const { onChain } = data;
  let { offChain, user } = data;

  if (!user) {
    user = await userProvider.getById(onChain.seller.id);
  }

  if (!offChain && user) {
    try {
      offChain = await listingProvider.create({
        id: onChain.id,
        sellerId: user?.id || onChain.seller.id,
      });
    } catch (error) {
      new Log("dataService", "mergeMinimalListing").all(error);
    }
  }

  return {
    ...onChain,
    coverUrl: getMediaUrl(offChain?.coverUri ?? null),
    description: stringifyDescription(offChain?.description),
    seller: mergeUser({ onChain: onChain.seller, offChain: user }),
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
}): Promise<IListingFull> => {
  const { onChain } = data;
  let { offChain, user } = data;

  if (!user) {
    user = await userProvider.getById(onChain.seller.id);
  }

  if (!offChain && user) {
    try {
      offChain = await listingProvider.create({
        id: onChain.id,
        sellerId: user?.id || onChain.seller.id,
      });
    } catch (error) {
      new Log("dataService", "mergeFullListing").all(error);
    }
  }

  return {
    ...onChain,
    coverUrl: getMediaUrl(offChain?.coverUri ?? null),
    description: stringifyDescription(offChain?.description),
    seller: mergeUser({ onChain: onChain.seller, offChain: user }),
  };
};

/**
 * Merge off-chain minimal order with on-chain data
 */
export const mergeMinimalOrder = async (data: {
  onChain: OrderMinimalFragment;
  offChain?: Order | null;
  client?: User | null;
  seller?: User | null;
}): Promise<IOrderPreview> => {
  let { offChain } = data;
  const { onChain: _onChain, client, seller } = data;
  const { tx, id: composedId, ...onChain } = _onChain;

  const { id, listingId } = splitOrderId(composedId);

  if (!offChain && client) {
    try {
      offChain = await orderProvider.create({
        id,
        listingId,
        composedId,
        tx,
        clientId: client.id,
      });
    } catch (error) {
      new Log("dataService", "mergeMinimalOrder").all(error);
    }
  }

  const lastEvent = onChain.events.sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp)
  )[0];

  return {
    ...onChain,
    id,
    composedId,
    lastEventAt: lastEvent.timestamp,
    client: mergeUser({ onChain: onChain.client, offChain: client }),
    seller: mergeUser({ onChain: onChain.seller, offChain: seller }),
  };
};

/**
 * Build order events, ordered by date. These include contract-defined
 * events such as order placement, cancellation, mixed with messages between
 * seller-client.
 *
 * #todo lazy load this and extract it to another endpoint
 */
export const buildOrderEvents = (data: {
  order: OrderFullFragment;
  messages: OrderMessage[];
}): IOrderEvent[] => {
  const { order, messages } = data;
  const events: IOrderEvent[] = [];

  // Push messages

  events.push(
    ...messages.map(
      (m) =>
        ({
          type: "message",
          timestamp: String(m.timestamp.getTime() / 1000),
          message: m.message,
          from: getFrom(order, m.senderId),
          mediaUrl: getMediaUrl(m.mediaUri),
        } as const)
    )
  );

  // Handle order native events

  events.push(
    ...order.events.map((ev) => ({
      timestamp: ev.timestamp,
      from: getFrom(order, ev.from.id),
      type: ev.type,
    }))
  );

  return events.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
};

/**
 * Merge full order
 */
export const mergeFullOrder = async (data: {
  onChain: OrderFullFragment;
  offChain?: (Order & { listing: Listing }) | null;
  client?: User | null;
  seller?: User | null;
  isSeller: boolean;
}): Promise<IOrderFull> => {
  let { offChain } = data;
  const { onChain: _onChain, client, seller, isSeller } = data;
  const { tx, id: composedId, ...onChain } = _onChain;

  const { id, listingId } = splitOrderId(composedId);

  if (!offChain && client) {
    try {
      offChain = await orderProvider.create({
        id,
        listingId,
        composedId,
        tx,
        clientId: client.id,
      });
    } catch (error) {
      new Log("dataService", "mergeFullOrder").all(error);
    }
  }

  const messages = offChain
    ? await orderProvider.getMessages(offChain.composedId)
    : [];

  return {
    ...onChain,
    id,
    composedId,
    isSeller,
    listing: {
      ...onChain.listing,
      coverUrl: getMediaUrl(offChain?.listing.coverUri ?? null),
      description: stringifyDescription(offChain?.listing.description),
    },
    events: buildOrderEvents({ order: data.onChain, messages }),
    client: mergeUser({ onChain: onChain.client, offChain: client }),
    seller: mergeUser({ onChain: onChain.seller, offChain: seller }),
  };
};
