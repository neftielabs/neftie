import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import type { UseQueryOptions } from "react-query";

import { useTypedQuery } from "hooks/http/useTypedQuery";

export const useGetOrderFromQuery = (
  options?: UseQueryOptions,
  listingIdParam = "listingId",
  orderIdParam = "orderId"
) => {
  const { query } = useRouter();
  const [composedId, setComposedId] = useState("");

  useEffect(() => {
    const listingId = query[listingIdParam];
    const orderId = query[orderIdParam];

    if (
      listingId &&
      typeof listingId === "string" &&
      orderId &&
      typeof orderId === "string"
    ) {
      setComposedId([listingId, orderId].join("_"));
    }
  }, [listingIdParam, orderIdParam, query]);

  return useTypedQuery(
    ["getMyOrder", composedId],
    {
      enabled: !!composedId,
      ...options,
    },
    [composedId]
  );
};
