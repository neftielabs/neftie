import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useTypedQuery } from "hooks/http/useTypedQuery";

export const useGetOrderFromQuery = (
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
    },
    [composedId]
  );
};
