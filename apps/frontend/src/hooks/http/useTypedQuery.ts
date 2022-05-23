import { useQuery } from "react-query";

import { useClient } from "hooks/http/useClient";
import type { UseTypedQuery } from "types/api";

/**
 * Wrapper for useQuery, to only use api-client defined
 * methods while infering the return type of the call.
 *
 * Originally written in {@link https://github.com/benawad/dogehouse}
 * and slightly adapted over time.
 */
export const useTypedQuery: UseTypedQuery = (key, opts?, params?) => {
  const client = useClient();

  return useQuery(
    key,
    () => {
      const fn = client.query[typeof key === "string" ? key : key[0]] as any;
      return fn(...(params || []));
    },
    opts as any
  );
};
