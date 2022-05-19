import { useMemo } from "react";

import { apiClient } from "@neftie/api-client";
import { useAxios } from "hooks/http/useAxios";

export const useClient = () => {
  const axios = useAxios();

  return useMemo(() => apiClient(axios), [axios]);
};
