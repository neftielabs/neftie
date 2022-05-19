import { useState } from "react";

import { useTypedQuery } from "hooks/http/useTypedQuery";
import type { TransactionStatus } from "types/tx";

export const useListingCreated = (): [
  { status: TransactionStatus; address: string },
  (a: string) => void
] => {
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [address, setAddress] = useState("");

  useTypedQuery(
    ["verifyListingExists"],
    {
      enabled: status === "pending",
      retry: true,
      retryDelay: 5000,
      onSuccess: () => setStatus("confirmed"),
    },
    [address]
  );

  const handleListingCreated = (predictedAddress: string) => {
    setAddress(predictedAddress);
    setStatus("pending");
  };

  return [{ status, address }, handleListingCreated];
};
