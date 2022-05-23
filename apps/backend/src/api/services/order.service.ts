import { userProvider } from "api/providers";
import { subgraphProvider } from "modules/subgraph-client";
import type { Result } from "types/helpers";

/**
 * Verify an order exists on the blockchain.
 */
export const onChainOrderExists = async (data: {
  clientAddress: string;
  listingId: string;
  txHash: string;
}): Promise<Result> => {
  const { clientAddress, listingId, txHash } = data;

  const user = await userProvider.getByAddress(clientAddress);

  if (!user) {
    return {
      success: false,
    };
  }

  const { client } = await subgraphProvider.getMinimalListingOrdersByClient({
    listingId: listingId.toLowerCase(),
    clientId: user.address.toLowerCase(),
  });

  if (!client?.orders.length) {
    return {
      success: false,
    };
  }

  const order = client.orders.find(
    (o) => o.tx.toLowerCase() === txHash.toLowerCase()
  );

  return {
    success: !!order,
  };
};
