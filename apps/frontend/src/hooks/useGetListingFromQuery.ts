import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useTypedQuery } from "hooks/http/useTypedQuery";

export const useGetListingFromQuery = (queryParam = "listingId") => {
  const { query } = useRouter();
  const [listingId, setListingId] = useState("");

  useEffect(() => {
    const param = query[queryParam];

    if (param && typeof param === "string") {
      setListingId(param);
    }
  }, [query, queryParam]);

  return useTypedQuery(
    "getListing",
    {
      enabled: !!listingId,
    },
    [listingId]
  );
};
