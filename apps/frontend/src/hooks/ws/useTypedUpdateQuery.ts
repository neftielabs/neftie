import { useCallback } from "react";

import type { SetDataOptions } from "react-query";
import { useQueryClient } from "react-query";

import type { UseTypedUpdateQuery } from "types/api";

export const useTypedUpdateQuery: UseTypedUpdateQuery = (
  opts?: SetDataOptions
) => {
  const queryClient = useQueryClient();

  return useCallback(
    (key, cb) => {
      queryClient.setQueryData(key, cb as any, opts);
    },
    [opts, queryClient]
  );
};
