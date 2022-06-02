import { useInfiniteQuery } from "react-query";

import { useClient } from "hooks/http/useClient";
import type { UseTypedInfQuery } from "types/api";

export const useTypedInfQuery: UseTypedInfQuery = (key, opts?, params?) => {
  const client = useClient();

  return useInfiniteQuery(
    key,
    (ctx) => {
      const fn = client.query[typeof key === "string" ? key : key[0]] as any;
      return fn({ ...(params as any), ...ctx });
    },
    opts as any
  );
};
