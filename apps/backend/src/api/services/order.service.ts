import type { IOrderFull, IOrderPreview, OrderEventType } from "@neftie/common";
import { areAddressesEqual, string } from "@neftie/common";
import type { Prisma, User } from "@neftie/prisma";
import type {
  GetOrderEventQuery,
  OrderMinimalFragment,
} from "@neftie/subgraph";
import { OrderEventType as OrderEventTypeEnum } from "@neftie/subgraph";
import { orderProvider, userProvider } from "api/providers";
import { dataService } from "api/services";
import { subgraphQuery } from "modules/subgraph-client";
import type { Pagination, Result } from "types/helpers";
import { splitOrderId } from "utils/helpers";

/**
 * Verify an order exists on the blockchain.
 */
export const onChainOrderExists = async (data: {
  clientId: string;
  listingId: string;
  txHash: string;
}): Promise<Result<IOrderPreview>> => {
  const { clientId, listingId, txHash } = data;

  const client = await userProvider.getById(clientId);

  const { orders } = await subgraphQuery("getMinimalOrdersByTx", {
    listingId,
    clientId,
    txHash,
  });

  const onChainOrder = orders.find(
    (o) => o.tx.toLowerCase() === txHash.toLowerCase()
  );

  if (!onChainOrder) {
    return {
      success: false,
    };
  }

  const seller = await userProvider.getById(onChainOrder.id);

  // Look up order

  const { id, listingId: _listingId } = splitOrderId(onChainOrder.id);

  const offChainOrder = await orderProvider.getByComposedId({
    listingId: _listingId,
    id,
  });

  return {
    success: true,
    data: await dataService.mergeMinimalOrder({
      onChain: onChainOrder,
      offChain: offChainOrder,
      client,
      seller,
    }),
  };
};

/**
 * Get all orders received by a seller or placed
 * by a client
 */
export const getUserOrders = async (data: {
  entity: "client" | "seller";
  userId: string;
  pagination: Pagination;
}): Promise<IOrderPreview[]> => {
  const { entity, userId, pagination } = data;

  const user = await userProvider.getById(userId);

  let seller: User | null = null;
  let client: User | null = null;

  const onChainOrders: OrderMinimalFragment[] = [];

  if (entity === "seller") {
    seller = user;

    const { orders } = await subgraphQuery("getSellerOrders", {
      sellerId: userId,
      ...pagination,
    });

    onChainOrders.push(...orders);
  } else {
    client = user;

    const { orders } = await subgraphQuery("getClientOrders", {
      clientId: userId,
      ...pagination,
    });

    onChainOrders.push(...orders);
  }

  const offChainOrders = await orderProvider.getMany({
    composedId: {
      in: onChainOrders.map((l) => l.id),
    },
  });

  const orders: IOrderPreview[] = [];

  for (const order of onChainOrders) {
    const offChainOrder = offChainOrders.find((o) => o.composedId === order.id);

    if (entity === "seller") {
      client = await userProvider.getById(order.client.id);
    } else {
      seller = await userProvider.getById(order.seller.id);
    }

    orders.push(
      await dataService.mergeMinimalOrder({
        onChain: order,
        offChain: offChainOrder,
        client,
        seller,
      })
    );
  }

  return orders;
};

/**
 * Get an order from a user
 */
export const getUserOrder = async (data: {
  userId: string;
  composedId: string | Prisma.OrderIdListingIdCompoundUniqueInput;
}) => {
  const { userId, composedId } = data;

  const user = await userProvider.getById(userId);
  if (!user) {
    return null;
  }

  let composedOrderId = "";

  if (typeof composedId === "string") {
    composedOrderId = composedId;
  } else {
    composedOrderId = [composedId.listingId, composedId.id].join("_");
  }

  const { order: onChainOrder } = await subgraphQuery("getOrderById", {
    composedOrderId,
  });

  if (
    !onChainOrder ||
    (!areAddressesEqual(userId, onChainOrder.seller.id) &&
      !areAddressesEqual(userId, onChainOrder.client.id))
  ) {
    return null;
  }

  const offChainOrder = await orderProvider.getByComposedId(composedId);

  let seller: User | null = user;
  let client: User | null = user;
  const isSeller = areAddressesEqual(userId, onChainOrder.seller.id);

  if (isSeller) {
    client = await userProvider.getById(onChainOrder.client.id);
  } else {
    seller = await userProvider.getById(onChainOrder.seller.id);
  }

  return await dataService.mergeFullOrder({
    onChain: onChainOrder,
    offChain: offChainOrder,
    isSeller,
    client,
    seller,
  });
};

/**
 * Check if an action has been registered on the blockchain by
 * querying the subgraph on an interval.
 */
export const lookupOrderEvent = (data: {
  composedOrderId: string;
  type: OrderEventType;
  interval: number;
  maxRetries: number;
  timestamps: [number, number];
}) =>
  new Promise<GetOrderEventQuery["orderEvents"][number]>((resolve, reject) => {
    const { composedOrderId, type, interval, maxRetries, timestamps } = data;

    let retries = maxRetries;
    const capitalizedType = string.capitalize(type, true);

    const intervalId = setInterval(async () => {
      console.log("querying", {
        composedOrderId,
        type: OrderEventTypeEnum[capitalizedType],
        minTimestamp: "" + timestamps[0],
        maxTimestamp: "" + timestamps[1],
      });

      if (retries === 0) {
        reject(new Error("No event found"));
        clearInterval(intervalId);
        return;
      }

      const events = await subgraphQuery("getOrderEvent", {
        composedOrderId,
        type: OrderEventTypeEnum[capitalizedType],
        minTimestamp: "" + timestamps[0],
        maxTimestamp: "" + timestamps[1],
      });

      if (events.orderEvents.length !== 0) {
        resolve(events.orderEvents[0]);
        clearInterval(intervalId);
        return;
      }

      retries--;
    }, interval);
  });

/**
 * Check if a user is either a seller or a client of
 * a given order
 */
export const is = (
  order: Pick<IOrderFull, "client" | "seller">,
  userId: string,
  target: "client" | "seller" | "some"
) => {
  const isSeller = areAddressesEqual(userId, order.seller.id);
  const isClient = areAddressesEqual(userId, order.client.id);

  if ((isClient || isSeller) && target === "some") {
    return true;
  } else if (isClient && target === "client") {
    return true;
  } else if (isSeller && target === "seller") {
    return true;
  }

  return false;
};
