import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import type { UseQueryOptions } from "react-query";

import { useTypedQuery } from "hooks/http/useTypedQuery";
import { useAuth } from "hooks/useAuth";
import { isStringQueryParam } from "utils/router";

export type UseGetUserOptions = {
  from:
    | {
        address: string;
      }
    | {
        currentUser: true;
      }
    | {
        queryParam: string;
      }
    | { noop: true };
};

export const useGetUser = (opts: UseQueryOptions & UseGetUserOptions) => {
  const [queryFrom, setQueryFrom] = useState<string>("");
  const { query } = useRouter();

  const { connectedAddress } = useAuth();

  const { from, ...queryOpts } = opts;

  useEffect(() => {
    if ("address" in from) {
      setQueryFrom(from.address);
    } else if ("currentUser" in from && connectedAddress) {
      setQueryFrom(connectedAddress);
    } else if ("queryParam" in from) {
      const q = query[from.queryParam];

      if (isStringQueryParam(q)) {
        setQueryFrom(q);
      }
    }
  }, [connectedAddress, from, query]);

  return useTypedQuery(
    ["getUser", queryFrom],
    {
      enabled: !!queryFrom,
      ...queryOpts,
    },
    [queryFrom]
  );
};
