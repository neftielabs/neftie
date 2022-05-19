import { useMutation } from "react-query";

import { useClient } from "hooks/http/useClient";
import type { UseTypedMutation } from "types/api";

/**
 * Wrapper for useMutation, to only use api-client defined
 * methods while infering the return type of the call.
 */
export const useTypedMutation: UseTypedMutation = (key, opts?) => {
  const client = useClient();

  return useMutation(
    (params) => (client.mutation[key] as any)(...params),
    opts
  );
};
