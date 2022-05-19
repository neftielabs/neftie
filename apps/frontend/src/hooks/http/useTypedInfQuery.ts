import { useClient } from "hooks/http/useClient";
import { useInfiniteQuery } from "react-query";
import { UseTypedInfQuery } from "types/api";

export const useTypedInfQuery: UseTypedInfQuery = (key, opts?, params?) => {
  const client = useClient();

  return useInfiniteQuery(
    key,
    (ctx) => {
      const fn = client.query[key] as any;
      return fn({ ...(params as any), ...ctx });
    },
    opts as any
  );
};
