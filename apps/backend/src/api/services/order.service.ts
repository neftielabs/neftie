import type { IOrderPreview } from "@neftie/common";
import { areAddressesEqual } from "@neftie/common";
import type { Prisma, User } from "@neftie/prisma";
import type { OrderMinimalFragment } from "@neftie/subgraph";
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
