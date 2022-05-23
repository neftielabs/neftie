import { useState } from "react";

import { useTypedQuery } from "hooks/http/useTypedQuery";
import type { TransactionStatus } from "types/tx";

export const useOrderPlaced = () => {
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [listingAddress, setListingAddress] = useState("");
  const [txHash, setTxHash] = useState("");

  useTypedQuery(
    "verifyOrderPlaced",
    {
      enabled: status === "pending",
      retry: true,
      retryDelay: 5000,
      onSuccess: () => setStatus("confirmed"),
    },
    [listingAddress, { txHash }]
  );

  const handleOrderPlaced = (_listingAddress: string, _txHash: string) => {
    setTxHash(_txHash);
    setListingAddress(_listingAddress);
    setStatus("pending");
  };

  return {
    status,
    handleOrderPlaced,
    listingAddress,
    txHash,
  };
};
