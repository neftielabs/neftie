import { useCallback, useState } from "react";

import type { Signer } from "ethers";

import type { WsConnection } from "@neftie/api-client";
import type { IOrderFull } from "@neftie/common";
import { areAddressesEqual } from "@neftie/common";
import { useContractMutation } from "hooks/http/useContractMutation";
import { useWs } from "hooks/ws/useWs";
import { getListingContract } from "lib/web3/contracts";
import { withGasMargin } from "lib/web3/gas";
import { useToastStore } from "stores/useToastStore";
import { everyTrue } from "utils/fp";

type CallbackFunc = (conn: WsConnection, ...args: any[]) => any;
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

/**
 * Triggers for all actions that can be done
 * regarding an order.
 */
export const useOrderActions = (order: IOrderFull) => {
  const [error, setError] = useState("");

  const { showToast } = useToastStore();

  const { conn } = useWs();

  const isSeller = useCallback(
    async (signer: Signer) =>
      everyTrue([
        areAddressesEqual(await signer.getAddress(), order.seller.id),
        order.isSeller,
      ]),
    [order.isSeller, order.seller.id]
  );

  const withConn = useCallback(
    <C extends CallbackFunc, O extends OmitFirstArg<C>>(cb: C) =>
      (...originalArgs: Parameters<O>): ReturnType<O> => {
        if (!conn) {
          throw new Error("No ws connection");
        }

        return cb(conn, ...originalArgs);
      },
    [conn]
  );

  /**
   * Approve an order (seller)
   */
  const approve = useContractMutation(
    withConn(async (ws, { signer }) => {
      if (!isSeller(signer)) {
        setError("Only a seller can perform this action");
        return;
      }

      const contract = await getListingContract(signer, order.listing.id);
      const tx = await withGasMargin(contract, "approveOrder", [order.id]);

      showToast({
        message: "Waiting for the transaction confirmation",
        isLoading: true,
      });

      return await ws.sendReplied("new_order_action", {
        orderComposedId: order.composedId,
        timestamp: tx.timestamp,
        action: "STARTED",
      });
    })
  );

  /**
   * Dismiss an order (seller and client)
   */
  const dismiss = useContractMutation(
    withConn(async (ws, { signer }) => {
      const contract = await getListingContract(signer, order.listing.id);
      const tx = await withGasMargin(contract, "dismissOrder", [order.id]);

      showToast({
        message: "Waiting for the transaction confirmation",
        isLoading: true,
      });

      return await ws.sendReplied("new_order_action", {
        orderComposedId: order.composedId,
        timestamp: tx.timestamp,
        action: "DISMISSED",
      });
    })
  );

  /**
   * Cancel order (seller and client)
   */
  const cancel = useContractMutation(
    withConn(async (ws, { signer }) => {
      const contract = await getListingContract(signer, order.listing.id);
      const tx = await withGasMargin(contract, "cancelOrder", [order.id]);

      showToast({
        message: "Waiting for the transaction confirmation",
        isLoading: true,
      });

      return await ws.sendReplied("new_order_action", {
        orderComposedId: order.composedId,
        timestamp: tx.timestamp,
        action: "CANCELLED",
      });
    })
  );

  /**
   * Deliver (seller)
   */
  const deliver = useContractMutation(
    withConn(async (ws, { signer }) => {
      if (!isSeller(signer)) {
        setError("Only a seller can perform this action");
        return;
      }

      const contract = await getListingContract(signer, order.listing.id);
      const tx = await withGasMargin(contract, "deliverOrder", [order.id]);

      showToast({
        message: "Waiting for the transaction confirmation",
        isLoading: true,
      });

      return await ws.sendReplied("new_order_action", {
        orderComposedId: order.composedId,
        timestamp: tx.timestamp,
        action: "DELIVERED",
      });
    })
  );

  /**
   * Request revision (client)
   */
  const revision = useContractMutation(
    withConn(async (ws, { signer }) => {
      if (
        !everyTrue([
          areAddressesEqual(await signer.getAddress(), order.client.id),
          !order.isSeller,
        ])
      ) {
        setError("Only a client can perform this action");
        return;
      }

      const contract = await getListingContract(signer, order.listing.id);
      const tx = await withGasMargin(contract, "requestRevision", [order.id]);

      showToast({
        message: "Waiting for the transaction confirmation",
        isLoading: true,
      });

      return await ws.sendReplied("new_order_action", {
        orderComposedId: order.composedId,
        timestamp: tx.timestamp,
        action: "REVISION",
      });
    })
  );

  return { approve, dismiss, cancel, revision, deliver, error };
};
